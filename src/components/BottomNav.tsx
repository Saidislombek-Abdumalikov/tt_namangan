import { Home, LayoutGrid, ShoppingBag, User } from 'lucide-react'

interface BottomNavProps {
  tab: 'home' | 'catalog' | 'cart' | 'profile'
  onTabChange: (tab: 'home' | 'catalog' | 'cart' | 'profile') => void
  cartCount: number
}

const TABS = [
  { id: 'home' as const, label: 'Bosh sahifa', Icon: Home },
  { id: 'catalog' as const, label: 'Katalog', Icon: LayoutGrid },
  { id: 'cart' as const, label: 'Savatcha', Icon: ShoppingBag },
  { id: 'profile' as const, label: 'Profil', Icon: User },
]

export default function BottomNav({ tab, onTabChange, cartCount }: BottomNavProps) {
  return (
    <nav className="w-full bg-surface/98 backdrop-blur-lg border-t border-bdr shadow-[0_-2px_12px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center h-16 px-1">
        {TABS.map(({ id, label, Icon }) => {
          const active = tab === id
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className="flex-1 flex flex-col items-center justify-center gap-1 h-full transition-all active:scale-95"
            >
              <div className="relative">
                <Icon
                  size={22}
                  strokeWidth={active ? 2.4 : 1.8}
                  className={active ? 'text-primary' : 'text-txt-3'}
                />
                {id === 'cart' && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-primary text-white text-[9px] font-bold min-w-4 h-4 flex items-center justify-center rounded-full px-1 shadow-xs animate-in zoom-in-75">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-semibold leading-none tracking-tight ${active ? 'text-primary' : 'text-txt-3'}`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
