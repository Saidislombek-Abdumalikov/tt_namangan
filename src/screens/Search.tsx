import { useState } from 'react'
import { ArrowLeft, X, Search, Plus } from 'lucide-react'
import type { AppProps, Product } from '../types'
import { PRODUCTS, formatPrice } from '../data'

const RECENT = ['Pizza', 'Burger', 'Lavash', 'Shokolad']
const POPULAR = ['Pepperoni', 'Double Burger', 'Shrimp Lavash', 'Tort']

interface SearchProps {
  navigate: AppProps['navigate']
  setSelectedProduct: AppProps['setSelectedProduct']
  addToCart: AppProps['addToCart']
}

function ResultCard({ product, onTap, onAdd }: { product: Product; onTap: () => void; onAdd: () => void }) {
  return (
    <div className="flex items-center gap-3 bg-surface rounded-2xl p-3 border border-bdr">
      <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-surface-3 cursor-pointer" onClick={onTap}>
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0 cursor-pointer" onClick={onTap}>
        <div className="text-txt-1 font-bold text-sm leading-tight line-clamp-1">{product.name}</div>
        <div className="text-txt-2 text-xs leading-tight line-clamp-1 mt-0.5">{product.description}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-primary font-bold text-sm">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-txt-3 text-xs line-through">{formatPrice(product.oldPrice)}</span>
          )}
        </div>
      </div>
      <button
        onClick={onAdd}
        className="w-9 h-9 bg-primary rounded-full flex items-center justify-center flex-shrink-0 active:bg-primary-press"
      >
        <Plus size={18} className="text-white" />
      </button>
    </div>
  )
}

export default function SearchScreen({ navigate, setSelectedProduct, addToCart }: SearchProps) {
  const [query, setQuery] = useState('')

  const results = query.length > 1
    ? PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      )
    : []

  const hasResults = results.length > 0
  const isSearching = query.length > 0

  return (
    <div className="bg-surface-2 min-h-full">
      {/* Search Header */}
      <div className="bg-surface px-4 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('home')}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-2"
          >
            <ArrowLeft size={20} className="text-txt-1" />
          </button>
          <div className="flex-1 flex items-center gap-2 bg-surface-2 border border-bdr rounded-2xl px-4 py-2.5">
            <Search size={17} className="text-txt-3 flex-shrink-0" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Taomlarni qidiring..."
              className="flex-1 bg-transparent text-txt-1 text-sm placeholder:text-txt-3 outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')}>
                <X size={15} className="text-txt-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 pb-4">
        {!isSearching && (
          <>
            <div className="mb-5">
              <h3 className="text-txt-1 font-bold text-sm mb-2">Yaqinda qidirilganlar</h3>
              <div className="flex flex-wrap gap-2">
                {RECENT.map(term => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="flex items-center gap-2 bg-surface border border-bdr rounded-full px-3 py-1.5"
                  >
                    <span className="text-txt-2 text-sm">{term}</span>
                    <X size={12} className="text-txt-3" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-txt-1 font-bold text-sm mb-2">Mashhur</h3>
              <div className="flex flex-wrap gap-2">
                {POPULAR.map(term => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="bg-primary-light text-primary text-sm font-semibold px-3 py-1.5 rounded-full"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {isSearching && hasResults && (
          <>
            <div className="text-txt-2 text-sm font-medium mb-3">
              "{query}" bo'yicha {results.length} ta natija
            </div>
            <div className="space-y-2">
              {results.map(product => (
                <ResultCard
                  key={product.id}
                  product={product}
                  onTap={() => setSelectedProduct(product)}
                  onAdd={() => addToCart({ product, quantity: 1, extras: [], totalPrice: product.price })}
                />
              ))}
            </div>
          </>
        )}

        {isSearching && !hasResults && (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <div className="text-txt-1 font-bold text-lg mb-2">Hech narsa topilmadi</div>
            <div className="text-txt-2 text-sm">Qidiruv so'rovini o'zgartirib ko'ring.</div>
          </div>
        )}
      </div>
    </div>
  )
}
