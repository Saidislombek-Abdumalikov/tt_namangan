import { useState } from 'react'
import { Bell, Heart, Plus, ChevronRight, Search, MapPin, Sparkles } from 'lucide-react'
import type { AppProps, Product } from '../types'
import { PRODUCTS, CATEGORIES, formatPrice } from '../data'

const STORIES = [
  { id: '1', label: "Bugungi aksiya", image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=80&h=80&fit=crop&auto=format', hasRing: true },
  { id: '2', label: 'Yangi', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=80&h=80&fit=crop&auto=format', hasRing: true },
  { id: '3', label: 'Combo', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=80&h=80&fit=crop&auto=format', hasRing: false },
  { id: '4', label: 'Chegirma', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=80&h=80&fit=crop&auto=format', hasRing: false },
  { id: '5', label: "To'lov", image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=80&h=80&fit=crop&auto=format', hasRing: false },
]

interface HomeProps {
  navigate: AppProps['navigate']
  favorites: AppProps['favorites']
  toggleFavorite: AppProps['toggleFavorite']
  setSelectedProduct: AppProps['setSelectedProduct']
  addToCart: AppProps['addToCart']
  showToast: AppProps['showToast']
  handleTabChange: AppProps['handleTabChange']
  user?: AppProps['user']
  userLocation?: string
  products?: Product[]
  categories?: any[]
}

function ProductCard({ product, isFav, onFav, onTap, onAdd }: {
  product: Product
  isFav: boolean
  onFav: () => void
  onTap: () => void
  onAdd: () => void
}) {
  return (
    <div className="bg-surface rounded-3xl overflow-hidden shadow-sm border border-bdr flex-shrink-0 w-44">
      <div className="relative h-32 bg-surface-3 cursor-pointer" onClick={onTap}>
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        {product.discount && (
          <div className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            -{product.discount}%
          </div>
        )}
        <button
          onClick={e => { e.stopPropagation(); onFav() }}
          className="absolute top-2 right-2 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center"
        >
          <Heart size={13} className={isFav ? 'text-primary fill-primary' : 'text-txt-2'} />
        </button>
      </div>
      <div className="p-3">
        <div className="text-txt-1 font-bold text-sm leading-tight mb-0.5 line-clamp-1">{product.name}</div>
        <div className="text-txt-2 text-xs leading-tight line-clamp-1 mb-2">{product.description}</div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-primary font-bold text-sm">{formatPrice(product.price)}</div>
            {product.oldPrice && (
              <div className="text-txt-3 text-xs line-through">{formatPrice(product.oldPrice)}</div>
            )}
          </div>
          <button
            onClick={onAdd}
            className="w-8 h-8 bg-primary rounded-full flex items-center justify-center active:bg-primary-press transition-colors"
          >
            <Plus size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}

function ProductGridCard({ product, isFav, onFav, onTap, onAdd }: {
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
          {product.inStock ? (
            <button
              onClick={onAdd}
              className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center active:bg-primary-press transition-colors shadow-xs"
              title="Savatchaga qo'shish"
            >
              <Plus size={16} className="text-white" />
            </button>
          ) : (
            <span className="text-xs text-txt-3 font-semibold bg-surface-3 px-2 py-1 rounded-lg">Tugagan</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Home({
  navigate,
  favorites,
  toggleFavorite,
  setSelectedProduct,
  addToCart,
  showToast,
  handleTabChange,
  user,
  userLocation,
  products,
  categories,
}: HomeProps) {
  const [activeCategory, setActiveCategory] = useState('all')

  const allProducts = (products && products.length > 0) ? products : PRODUCTS
  const allCategories = (categories && categories.length > 0) ? categories : CATEGORIES

  const inStockProducts = allProducts.filter(p => p.inStock)
  const popular = inStockProducts.slice(0, 5)
  const discounted = inStockProducts.filter(p => p.discount)
  const foodCategories = allCategories.filter(c => (c.id !== 'all' && c.slug !== 'all'))

  return (
    <div className="bg-surface-2 min-h-full pb-6">
      {/* Header - Brand & Location (Cleaned - No logo box, no bell icon) */}
      <div className="bg-surface px-5 pt-12 pb-4 border-b border-bdr/60">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-txt-3 text-[11px] font-semibold flex items-center gap-1.5">
              <MapPin size={13} className="text-primary" />
              Yetkazib berish manzili
            </div>
            <div className="text-txt-1 font-bold text-sm tracking-tight truncate max-w-[260px] mt-0.5">
              {userLocation || 'Namangan shahri'}
            </div>
          </div>
          <div className="text-primary font-extrabold text-xs tracking-wider bg-primary/10 px-3 py-1.5 rounded-full">
            TEZKOR TAOM
          </div>
        </div>

        <div className="mt-3">
          <div className="text-txt-3 text-xs font-medium">
            {user?.first_name ? `Xush kelibsiz, ${user.first_name} 👋` : 'Xush kelibsiz! 👋'}
          </div>
          <h1 className="text-txt-1 font-extrabold text-2xl tracking-tight">Bugun nima tanlaysiz?</h1>
        </div>

        {/* Search bar */}
        <button
          onClick={() => navigate('search')}
          className="mt-3 w-full flex items-center gap-3 bg-surface-2 border border-bdr rounded-2xl px-4 py-3 active:bg-surface-3 transition-colors"
        >
          <Search size={18} className="text-txt-3" />
          <span className="text-txt-3 text-sm font-medium">Taomlar, osh, shashlik qidiring...</span>
        </button>
      </div>

      {/* Stories */}
      <div className="bg-surface py-3.5 mt-1 border-b border-bdr/40">
        <div className="flex gap-4 px-5 overflow-x-auto">
          {STORIES.map(story => (
            <button key={story.id} className="flex flex-col items-center gap-1.5 flex-shrink-0 active:scale-95 transition-transform">
              <div className={`w-14 h-14 rounded-full p-0.5 ${story.hasRing ? 'bg-primary' : 'bg-surface-3'}`}>
                <div className="w-full h-full rounded-full overflow-hidden bg-surface-3 border-2 border-surface">
                  <img src={story.image} alt={story.label} className="w-full h-full object-cover" />
                </div>
              </div>
              <span className="text-txt-2 text-[10px] font-semibold text-center w-14 leading-tight">{story.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Promo Banner */}
      <div className="px-4 mt-3">
        <div className="relative h-40 rounded-3xl overflow-hidden bg-surface-3 shadow-xs">
          <img
            src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=400&fit=crop&auto=format"
            alt="Promo"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-5">
            <div className="flex items-center gap-1 text-primary-light text-xs font-bold mb-1">
              <Sparkles size={13} />
              <span>Bugungi maxsus taklif</span>
            </div>
            <div className="text-white font-extrabold text-2xl leading-tight mb-3">20% gacha<br />chegirma</div>
            <button
              onClick={() => handleTabChange('catalog')}
              className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-full self-start active:bg-primary-press transition-colors shadow-sm"
            >
              Ko'rish →
            </button>
          </div>
        </div>
      </div>

      {/* Popular Products Carousel */}
      <div className="mt-5">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-txt-1 font-bold text-base">Ko'p buyurtma qilinadiganlar</h2>
          <button
            onClick={() => handleTabChange('catalog')}
            className="flex items-center gap-1 text-primary text-xs font-semibold"
          >
            Barchasi <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex gap-3 px-4 overflow-x-auto pb-1">
          {popular.map(product => (
            <ProductCard
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
              onAdd={() => {
                addToCart({ product, quantity: 1, extras: [], totalPrice: product.price })
              }}
            />
          ))}
        </div>
      </div>

      {/* Categories Bar */}
      <div className="mt-5 bg-surface py-3 border-y border-bdr">
        <div className="px-4 mb-2 flex items-center justify-between">
          <div className="text-txt-1 font-extrabold text-base">Taomlar menyusi</div>
          <span className="text-txt-3 text-xs font-semibold">{inStockProducts.length} xil taom</span>
        </div>
        <div className="flex gap-2 px-4 overflow-x-auto pb-0.5">
          {allCategories.map(cat => {
            const catKey = cat.id || cat.slug
            const isCatActive = activeCategory === catKey
            return (
              <button
                key={catKey}
                onClick={() => setActiveCategory(catKey)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold transition-all ${
                  isCatActive
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface-2 text-txt-2 border border-bdr active:bg-surface-3'
                }`}
              >
                <span>{cat.emoji || '🍽️'}</span>
                <span>{cat.label || cat.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Meals Display Section */}
      <div className="px-4 mt-4 space-y-6">
        {activeCategory === 'all' ? (
          // HAMMASI: All meals in stock organized neatly by category order!
          foodCategories.map(cat => {
            const catKey = cat.id || cat.slug
            const catLabel = cat.label || cat.name
            const catProducts = inStockProducts.filter(p => p.category === catKey || p.category === catLabel || p.category === cat.name)
            if (catProducts.length === 0) return null

            return (
              <div key={catKey} className="space-y-3">
                <div className="flex items-center justify-between border-b border-bdr/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{cat.emoji || '🍽️'}</span>
                    <h3 className="text-txt-1 font-extrabold text-base">{catLabel}</h3>
                  </div>
                  <span className="text-txt-3 text-xs font-medium">{catProducts.length} ta taom</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {catProducts.map(product => (
                    <ProductGridCard
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
                      onAdd={() => {
                        addToCart({ product, quantity: 1, extras: [], totalPrice: product.price })
                      }}
                    />
                  ))}
                </div>
              </div>
            )
          })
        ) : (
          // Single Selected Category: Show meals belonging to this category in order
          (() => {
            const currentCat = allCategories.find(c => (c.id === activeCategory || c.slug === activeCategory))
            const catLabel = currentCat?.label || currentCat?.name
            const catProducts = inStockProducts.filter(p => p.category === activeCategory || p.category === catLabel || p.category === currentCat?.name)

            return (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-bdr/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{currentCat?.emoji || '🍽️'}</span>
                    <h3 className="text-txt-1 font-extrabold text-lg">{catLabel}</h3>
                  </div>
                  <span className="text-txt-3 text-xs font-semibold">{catProducts.length} ta taom mavjud</span>
                </div>
                {catProducts.length === 0 ? (
                  <div className="bg-surface rounded-2xl p-6 text-center text-txt-3 text-sm">
                    Bu bo'limda hozircha taomlar mavjud emas.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {catProducts.map(product => (
                      <ProductGridCard
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
                        onAdd={() => {
                          addToCart({ product, quantity: 1, extras: [], totalPrice: product.price })
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })()
        )}
      </div>

      {/* Discounts Section */}
      {discounted.length > 0 && activeCategory === 'all' && (
        <div className="mt-8">
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="text-txt-1 font-bold text-base">Chegirmali taomlar 🔥</h2>
            <button
              onClick={() => handleTabChange('catalog')}
              className="flex items-center gap-1 text-primary text-xs font-semibold"
            >
              Barchasi <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex gap-3 px-4 overflow-x-auto pb-2">
            {discounted.map(product => (
              <ProductCard
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
                onAdd={() => {
                  addToCart({ product, quantity: 1, extras: [], totalPrice: product.price })
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
