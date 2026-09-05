import { useState, useEffect } from 'react'
import { Minus, Plus, Trash2, ShoppingBag, Tag, Check, X } from 'lucide-react'
import type { AppProps } from '../types'
import { PRODUCTS, formatPrice } from '../data'
import { triggerHaptic } from '../services/telegram'

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

const VALID_PROMOS: Record<string, number> = {
  TT10: 0.1,
  YANGI: 0.1,
  NAMANGAN: 0.1,
  TAOM10: 0.1,
  CHEGIRMA: 0.1,
}

export default function Cart({ navigate, cart, removeFromCart, updateQuantity, addToCart, showToast, handleTabChange }: CartProps) {
  const [promoCode, setPromoCode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('tt_promo') || ''
    }
    return ''
  })
  const [promoInput, setPromoInput] = useState('')
  const [promoApplied, setPromoApplied] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = localStorage.getItem('tt_promo')
      return Boolean(p && VALID_PROMOS[p.toUpperCase()])
    }
    return false
  })

  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0)
  const deliveryFee = subtotal > 0 ? 10000 : 0
  
  // Discount: from valid promo (10%)
  let discount = 0
  if (promoApplied && promoCode && VALID_PROMOS[promoCode.toUpperCase()]) {
    discount = Math.round(subtotal * VALID_PROMOS[promoCode.toUpperCase()])
  }

  const total = Math.max(0, subtotal + deliveryFee - discount)

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase()
    if (!code) return
    if (VALID_PROMOS[code]) {
      setPromoCode(code)
      setPromoApplied(true)
      localStorage.setItem('tt_promo', code)
      showToast(`✓ "${code}" promokodi qo'llandi! -10% chegirma`)
      triggerHaptic('notification', 'success')
      setPromoInput('')
    } else {
      showToast('❌ Noto\'g\'ri promokod. Masalan: TT10, YANGI')
      triggerHaptic('notification', 'error')
    }
  }

  const handleRemovePromo = () => {
    setPromoCode('')
    setPromoApplied(false)
    localStorage.removeItem('tt_promo')
    showToast('Promokod olib tashlandi')
    triggerHaptic('impact', 'light')
  }

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

        {/* Promo Code Section */}
        <div className="bg-surface rounded-2xl p-4 border border-bdr mt-2">
          <div className="flex items-center gap-2 mb-2.5">
            <Tag size={16} className="text-primary" />
            <span className="text-txt-1 font-bold text-sm">Promokod</span>
          </div>
          {promoApplied ? (
            <div className="flex items-center justify-between bg-primary-light/40 border border-primary/30 rounded-xl px-3.5 py-2.5">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white">
                  <Check size={12} strokeWidth={3} />
                </div>
                <div>
                  <span className="font-extrabold text-sm text-txt-1 tracking-wider">{promoCode}</span>
                  <span className="text-primary text-xs font-semibold ml-2">-10% chegirma</span>
                </div>
              </div>
              <button
                onClick={handleRemovePromo}
                className="w-7 h-7 rounded-full bg-surface hover:bg-surface-3 flex items-center justify-center text-txt-3 transition-colors"
                title="O'chirish"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Promokodni kiriting (masalan: TT10)"
                value={promoInput}
                onChange={e => setPromoInput(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && handleApplyPromo()}
                className="flex-1 bg-surface-2 border border-bdr rounded-xl px-3.5 py-2.5 text-sm font-semibold text-txt-1 placeholder:text-txt-3 placeholder:font-normal outline-none focus:border-primary uppercase tracking-wider transition-colors"
              />
              <button
                onClick={handleApplyPromo}
                disabled={!promoInput.trim()}
                className="bg-primary text-white font-bold text-xs px-4 py-2.5 rounded-xl active:bg-primary-press disabled:opacity-50 transition-all shadow-xs"
              >
                Qo'llash
              </button>
            </div>
          )}
        </div>

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
