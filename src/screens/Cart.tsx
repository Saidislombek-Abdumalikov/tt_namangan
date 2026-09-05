import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import type { AppProps } from '../types'
import { PRODUCTS, formatPrice } from '../data'

interface CartProps {
  navigate: AppProps['navigate']
  cart: AppProps['cart']
  removeFromCart: AppProps['removeFromCart']
  updateQuantity: AppProps['updateQuantity']
  addToCart: AppProps['addToCart']
  showToast: AppProps['showToast']
  handleTabChange: AppProps['handleTabChange']
}

const UPSELL = PRODUCTS.find(p => p.id === 'ichim-1') || PRODUCTS[0]

export default function Cart({ navigate, cart, removeFromCart, updateQuantity, addToCart, showToast, handleTabChange }: CartProps) {
  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0)
  const deliveryFee = subtotal > 0 ? 10000 : 0
  const discount = subtotal > 50000 ? 5000 : 0
  const total = subtotal + deliveryFee - discount

  const hasUpsell = !cart.find(i => i.product.id === UPSELL.id)

  if (cart.length === 0) {
    return (
      <div className="bg-surface min-h-full flex flex-col items-center justify-center px-8 text-center">
        <div className="w-24 h-24 bg-primary-light rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={40} className="text-primary" />
        </div>
        <h2 className="text-txt-1 font-bold text-xl mb-2">Savatchangiz hozircha bo'sh</h2>
        <p className="text-txt-2 text-sm leading-relaxed mb-8">Sevimli taomlaringizni tanlashni boshlang.</p>
        <button
          onClick={() => handleTabChange('catalog')}
          className="bg-primary text-white font-bold px-8 py-4 rounded-2xl active:bg-primary-press"
        >
          Katalogni ko'rish
        </button>
      </div>
    )
  }

  return (
    <div className="bg-surface-2 min-h-full">
      <div className="bg-surface px-5 pt-12 pb-4">
        <h1 className="text-txt-1 font-extrabold text-2xl">
          Savatcha <span className="text-primary">{cart.reduce((a, b) => a + b.quantity, 0)}</span>
        </h1>
      </div>

      <div className="px-4 pt-3 space-y-2">
        {cart.map((item, idx) => (
          <div key={idx} className="bg-surface rounded-2xl p-4 flex items-center gap-3 border border-bdr">
            <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-surface-3">
              <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-txt-1 font-bold text-sm leading-tight line-clamp-1">{item.product.name}</div>
              {item.extras.length > 0 && (
                <div className="text-txt-2 text-xs mt-0.5 line-clamp-1">{item.extras.join(', ')}</div>
              )}
              <div className="text-primary font-bold text-sm mt-1">{formatPrice(item.totalPrice)}</div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={() => removeFromCart(item.product.id, item.extras)}
                className="w-7 h-7 rounded-full bg-err-light flex items-center justify-center"
              >
                <Trash2 size={13} className="text-err" />
              </button>
              <div className="flex items-center gap-2 bg-surface-2 rounded-full px-1 py-1">
                <button
                  onClick={() => updateQuantity(item.product.id, Math.max(0, item.quantity - 1), item.extras)}
                  className="w-6 h-6 rounded-full bg-surface border border-bdr flex items-center justify-center"
                >
                  <Minus size={12} className="text-txt-1" />
                </button>
                <span className="text-txt-1 font-bold text-sm w-4 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.extras)}
                  className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                >
                  <Plus size={12} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Upsell */}
        {hasUpsell && (
          <div className="bg-primary-light rounded-2xl p-4 border border-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-surface-3">
                <img src={UPSELL.image} alt={UPSELL.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-txt-1 text-xs font-medium leading-tight">Bunga qo'shimcha ravishda</div>
                <div className="text-txt-1 font-bold text-sm">{UPSELL.name}</div>
                <div className="text-primary text-xs font-semibold">atigi {formatPrice(UPSELL.price)}</div>
              </div>
              <button
                onClick={() => {
                  addToCart({ product: UPSELL, quantity: 1, extras: [], totalPrice: UPSELL.price })
                  showToast(`✓ ${UPSELL.name} savatchaga qo'shildi`)
                }}
                className="w-9 h-9 bg-primary rounded-full flex items-center justify-center active:bg-primary-press"
              >
                <Plus size={18} className="text-white" />
              </button>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="bg-surface rounded-2xl p-4 border border-bdr mt-2">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-txt-2">Mahsulotlar</span>
              <span className="text-txt-1 font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-txt-2">Yetkazib berish</span>
              <span className="text-txt-1 font-semibold">{formatPrice(deliveryFee)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-txt-2">Chegirma</span>
                <span className="text-success font-semibold">-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="h-px bg-bdr" />
            <div className="flex justify-between">
              <span className="text-txt-1 font-bold">Jami</span>
              <span className="text-primary font-extrabold text-lg">{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('checkout')}
          className="w-full bg-primary text-white font-bold text-base py-4 rounded-2xl active:bg-primary-press transition-colors mt-2"
        >
          Buyurtmani tasdiqlash
        </button>
        <div className="h-4" />
      </div>
    </div>
  )
}
