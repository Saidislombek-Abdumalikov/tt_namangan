import { useState } from 'react'
import { Search, Heart, Plus, ArrowLeft, ChevronRight, UtensilsCrossed } from 'lucide-react'
import type { AppProps, Product } from '../types'
import { PRODUCTS, CATEGORIES, formatPrice } from '../data'

interface CatalogProps {
  navigate: AppProps['navigate']
  favorites: AppProps['favorites']
  toggleFavorite: AppProps['toggleFavorite']
  setSelectedProduct: AppProps['setSelectedProduct']
  addToCart: AppProps['addToCart']
  showToast: AppProps['showToast']
}

const CATEGORY_META: Record<string, { image: string; desc: string }> = {
  osh: {
    image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600&h=400&fit=crop&auto=format',
    desc: "To'y oshi, choyxona palov",
  },
  shashlik: {
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop&auto=format',
    desc: "Qo'y va qiyma mangal shashliklar",
  },
  somsa: {
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop&auto=format',
    desc: "Issiq tandir somsalari",
  },
  milliy: {
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop&auto=format',
    desc: "Qozon kabob, manti, sho'rva",
  },
  lagmon: {
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop&auto=format',
    desc: "Cho'zma va qovurma lag'mon",
  },
  fastfood: {
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop&auto=format',
    desc: "Pitsa, burger, tovuqli lavash",
  },
  ichimliklar: {
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&h=400&fit=crop&auto=format',
    desc: "Muzdek ichimliklar va choylar",
  },
  shirinliklar: {
    image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=600&h=400&fit=crop&auto=format',
    desc: "Namangan paxlavasi va tortlar",
  },
}

function GridCard({ product, isFav, onFav, onTap, onAdd }: {
  product: Product
  isFav: boolean
  onFav: () => void
  onTap: () => void
  onAdd: () => void
}) {
  return (
    <div className="bg-surface rounded-2xl overflow-hidden border border-bdr shadow-xs flex flex-col justify-between hover:border-primary/40 transition-colors">
      <div className="relative h-36 bg-surface-3 cursor-pointer" onClick={onTap}>
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        {product.discount && (
          <div className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
            -{product.discount}%
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-xs font-semibold bg-black/60 px-3 py-1 rounded-full">
              Mavjud emas
            </span>
          </div>
        )}
        <button
          onClick={e => { e.stopPropagation(); onFav() }}
          className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center active:scale-90 transition-transform shadow-xs"
        >
          <Heart size={14} className={isFav ? 'text-primary fill-primary' : 'text-txt-2'} />
        </button>
      </div>
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-txt-1 font-bold text-sm leading-tight mb-1 line-clamp-1">{product.name}</div>
          <div className="text-txt-2 text-xs leading-relaxed line-clamp-2 mb-2">{product.description}</div>
        </div>
        <div className="flex items-end justify-between pt-1">
          <div>
            <div className="text-primary font-bold text-sm leading-none">{formatPrice(product.price)}</div>
            {product.oldPrice && (
              <div className="text-txt-3 text-[11px] line-through mt-0.5">{formatPrice(product.oldPrice)}</div>
            )}
          </div>
          {product.inStock && (
            <button
              onClick={onAdd}
              className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center active:bg-primary-press transition-colors shadow-xs"
              title="Savatchaga qo'shish"
            >
              <Plus size={16} className="text-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Catalog({
  navigate,
  favorites,
  toggleFavorite,
  setSelectedProduct,
  addToCart,
  showToast,
}: CatalogProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const foodCategories = CATEGORIES.filter(c => c.id !== 'all')
  const currentCategory = foodCategories.find(c => c.id === selectedCategoryId)

  const inStockProducts = PRODUCTS.filter(p => p.inStock)
  const categoryProducts = selectedCategoryId
    ? inStockProducts.filter(p => p.category === selectedCategoryId)
    : []

  const displayedMeals = searchQuery.trim()
    ? categoryProducts.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categoryProducts

  // 1. If NO category is selected: Show ONLY the Catalog of Categories
  if (!selectedCategoryId || !currentCategory) {
    return (
      <div className="bg-surface-2 min-h-full pb-8">
        {/* Header */}
        <div className="bg-surface px-5 pt-12 pb-4 border-b border-bdr/60">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-txt-1 font-extrabold text-2xl tracking-tight">Katalog</h1>
            <span className="text-txt-3 text-xs font-semibold">{foodCategories.length} ta kategoriya</span>
          </div>
          <p className="text-txt-2 text-xs mb-3">Bo'limlardan birini tanlang va taomlarni ko'ring</p>

          {/* Search bar */}
          <button
            onClick={() => navigate('search')}
            className="w-full flex items-center gap-3 bg-surface-2 border border-bdr rounded-2xl px-4 py-3 active:bg-surface-3 transition-colors"
          >
            <Search size={18} className="text-txt-3" />
            <span className="text-txt-3 text-sm font-medium">Barcha taomlardan qidiring...</span>
          </button>
        </div>

        {/* Categories Grid (Only categories, no meals) */}
        <div className="px-4 pt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {foodCategories.map(cat => {
              const count = inStockProducts.filter(p => p.category === cat.id).length
              const meta = CATEGORY_META[cat.id]
              const coverImage = meta?.image || 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=400&h=300&fit=crop&auto=format'
              const desc = meta?.desc || `${count} xil sara taom`

              return (
                <div
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategoryId(cat.id)
                    setSearchQuery('')
                  }}
                  className="group relative bg-surface rounded-2xl overflow-hidden border border-bdr shadow-xs cursor-pointer active:scale-98 transition-all hover:border-primary/50"
                >
                  {/* Category Image Banner */}
                  <div className="relative h-28 w-full bg-surface-3 overflow-hidden">
                    <img
                      src={coverImage}
                      alt={cat.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    
                    {/* Emoji Badge */}
                    <div className="absolute top-2 left-2 w-8 h-8 rounded-xl bg-surface/90 backdrop-blur-md flex items-center justify-center text-base shadow-xs">
                      {cat.emoji}
                    </div>

                    {/* Count Badge */}
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {count} ta
                    </div>

                    {/* Category Title on image bottom */}
                    <div className="absolute bottom-2 left-2.5 right-2.5">
                      <div className="text-white font-extrabold text-sm leading-tight drop-shadow-sm">
                        {cat.label}
                      </div>
                    </div>
                  </div>

                  {/* Subtitle / Description & Arrow */}
                  <div className="p-2.5 flex items-center justify-between bg-surface">
                    <div className="text-txt-2 text-[11px] leading-tight line-clamp-1 pr-1">
                      {desc}
                    </div>
                    <div className="w-5 h-5 rounded-full bg-surface-2 flex items-center justify-center flex-shrink-0 text-txt-2 group-hover:text-primary group-hover:bg-primary-light transition-colors">
                      <ChevronRight size={13} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // 2. If a Category IS selected: Show Meals of THAT Category!
  return (
    <div className="bg-surface-2 min-h-full pb-8">
      {/* Category Header with Back Button */}
      <div className="bg-surface px-5 pt-12 pb-4 border-b border-bdr/60">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => {
              setSelectedCategoryId(null)
              setSearchQuery('')
            }}
            className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center active:bg-surface-3 transition-colors text-txt-1 shadow-xs"
            title="Katalogga qaytish"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xl">{currentCategory.emoji}</span>
              <h1 className="text-txt-1 font-extrabold text-xl leading-tight">{currentCategory.label}</h1>
            </div>
            <div className="text-txt-3 text-xs font-medium mt-0.5">
              {displayedMeals.length} ta taom mavjud
            </div>
          </div>
        </div>

        {/* Search within this category */}
        <div className="relative mt-2">
          <input
            type="text"
            placeholder={`${currentCategory.label} ichidan qidirish...`}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-surface-2 border border-bdr rounded-2xl pl-10 pr-4 py-2.5 text-sm text-txt-1 placeholder:text-txt-3 focus:outline-none focus:border-primary transition-colors"
          />
          <Search size={16} className="absolute left-3.5 top-3.5 text-txt-3" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-txt-3 hover:text-txt-1 bg-surface-3 px-2 py-0.5 rounded-full"
            >
              Tozalash
            </button>
          )}
        </div>
      </div>

      {/* Meals Grid inside Selected Category */}
      <div className="px-4 pt-4">
        {displayedMeals.length === 0 ? (
          <div className="bg-surface rounded-2xl p-8 text-center text-txt-3 text-sm my-6 border border-bdr">
            <UtensilsCrossed size={32} className="mx-auto mb-2 text-txt-3/50" />
            Taom topilmadi. Qidiruv so'zini o'zgartirib ko'ring.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {displayedMeals.map(product => (
              <GridCard
                key={product.id}
                product={product}
                isFav={favorites.includes(product.id)}
                onFav={() => {
                  toggleFavorite(product.id)
                  showToast(
                    favorites.includes(product.id)
                      ? '✓ Sevimlilardan olib tashlandi'
                      : "✓ Sevimlilarga qo'shildi"
                  )
                }}
                onTap={() => setSelectedProduct(product)}
                onAdd={() => addToCart({ product, quantity: 1, extras: [], totalPrice: product.price })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
