import { useState, useEffect } from 'react'
import { X, Minus, Plus, Heart } from 'lucide-react'
import type { Product, CartItem } from '../types'
import { formatPrice } from '../data'

interface ProductSheetProps {
  product: Product
  isFavorite: boolean
  onClose: () => void
  onAdd: (item: CartItem) => void
  onToggleFavorite: (id: string) => void
}

export default function ProductSheet({ product, isFavorite, onClose, onAdd, onToggleFavorite }: ProductSheetProps) {
  const [qty, setQty] = useState(1)
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 300)
  }

  const extrasTotal = (product.extras ?? [])
    .filter(e => selectedExtras.includes(e.name))
    .reduce((sum, e) => sum + e.price, 0)

  const unitPrice = product.price + extrasTotal
  const totalPrice = unitPrice * qty

  const toggleExtra = (name: string) => {
    setSelectedExtras(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    )
  }

  const handleAdd = () => {
    onAdd({
      product,
      quantity: qty,
      extras: selectedExtras,
      totalPrice,
    })
    handleClose()
  }

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />

      {/* Sheet */}
      <div
        className={`relative bg-surface rounded-t-3xl overflow-hidden transition-transform duration-300 ease-out max-h-[88%] flex flex-col ${
          visible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Image */}
        <div className="relative h-52 flex-shrink-0 bg-surface-3">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 w-9 h-9 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
          >
            <X size={18} />
          </button>
          <button
            onClick={() => onToggleFavorite(product.id)}
            className="absolute top-3 left-3 w-9 h-9 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <Heart
              size={18}
              className={isFavorite ? 'text-primary fill-primary' : 'text-white'}
            />
          </button>
          {product.discount && (
            <div className="absolute bottom-3 left-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
              -{product.discount}%
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 pt-4 pb-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h2 className="text-txt-1 font-bold text-xl leading-tight flex-1">{product.name}</h2>
            <div className="text-right flex-shrink-0">
              <div className="text-primary font-bold text-xl">{formatPrice(product.price)}</div>
              {product.oldPrice && (
                <div className="text-txt-3 text-sm line-through">{formatPrice(product.oldPrice)}</div>
              )}
            </div>
          </div>

          <p className="text-txt-2 text-sm leading-relaxed mb-4">{product.description}</p>

          {product.ingredients && product.ingredients.length > 0 && (
            <div className="mb-4">
              <h3 className="text-txt-1 font-semibold text-sm mb-2">Tarkibi</h3>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map(ing => (
                  <span key={ing} className="bg-surface-2 text-txt-2 text-xs px-3 py-1 rounded-full border border-bdr">
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.extras && product.extras.length > 0 && (
            <div className="mb-4">
              <h3 className="text-txt-1 font-semibold text-sm mb-2">Qo'shimchalar</h3>
              <div className="space-y-2">
                {product.extras.map(extra => (
                  <button
                    key={extra.name}
                    onClick={() => toggleExtra(extra.name)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border transition-colors ${
                      selectedExtras.includes(extra.name)
                        ? 'border-primary bg-primary-light'
                        : 'border-bdr bg-surface'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          selectedExtras.includes(extra.name)
                            ? 'border-primary bg-primary'
                            : 'border-bdr'
                        }`}
                      >
                        {selectedExtras.includes(extra.name) && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="text-txt-1 text-sm font-medium">{extra.name}</span>
                    </div>
                    <span className="text-primary text-sm font-semibold">+{formatPrice(extra.price)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-txt-1 font-semibold">Miqdor</span>
            <div className="flex items-center gap-4 bg-surface-2 rounded-full px-2 py-1">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-full bg-surface flex items-center justify-center shadow-sm border border-bdr active:bg-surface-3 transition-colors"
              >
                <Minus size={16} className="text-txt-1" />
              </button>
              <span className="text-txt-1 font-bold text-lg w-6 text-center">{qty}</span>
              <button
                onClick={() => setQty(q => q + 1)}
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center active:bg-primary-press transition-colors"
              >
                <Plus size={16} className="text-white" />
              </button>
            </div>
          </div>

          {/* Spacer for sticky button */}
          <div className="h-24" />
        </div>

        {/* Sticky CTA */}
        <div className="absolute bottom-0 left-0 right-0 bg-surface border-t border-bdr px-5 pt-3 pb-5">
          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className={`w-full font-bold text-base py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors ${
              product.inStock
                ? 'bg-primary text-white active:bg-primary-press shadow-md'
                : 'bg-surface-3 text-txt-3 cursor-not-allowed border border-bdr'
            }`}
          >
            {product.inStock ? (
              <>
                <span>Savatchaga qo'shish</span>
                <span className="opacity-80">—</span>
                <span>{formatPrice(totalPrice)}</span>
              </>
            ) : (
              <span>Hozirda mavjud emas (Tugagan)</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
