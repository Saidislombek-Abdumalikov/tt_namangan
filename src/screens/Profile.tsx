import { ChevronRight, ArrowLeft, Heart, Plus, MapPin, Bell, Star, Repeat2, Trash2, Package } from 'lucide-react'
import type { AppProps, Order } from '../types'
import { MOCK_ORDERS, PRODUCTS, formatPrice } from '../data'

// ---- Order History ----

interface OrderHistoryProps {
  navigate: AppProps['navigate']
  setViewingOrder: AppProps['setViewingOrder']
  addToCart: AppProps['addToCart']
  showToast: AppProps['showToast']
  orders?: Order[]
}

const STATUS_MAP = {
  pending: { label: 'Kutilmoqda', color: 'text-warn bg-warn-light' },
  preparing: { label: 'Jarayonda', color: 'text-primary bg-primary-light' },
  on_the_way: { label: "Yo'lda", color: 'text-primary bg-primary-light' },
  delivered: { label: 'Yetkazildi', color: 'text-success bg-success-light' },
  cancelled: { label: 'Bekor qilindi', color: 'text-err bg-err-light' },
}

export function OrderHistoryScreen({ navigate, setViewingOrder, addToCart, showToast, orders }: OrderHistoryProps) {
  const displayOrders = orders || []

  if (displayOrders.length === 0) {
    return (
      <div className="bg-surface-2 min-h-full">
        <div className="bg-surface px-5 pt-12 pb-4 flex items-center gap-4">
          <button onClick={() => navigate('profile')} className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-2">
            <ArrowLeft size={20} className="text-txt-1" />
          </button>
          <h1 className="text-txt-1 font-extrabold text-xl">Mening buyurtmalarim</h1>
        </div>
        <div className="px-5 pt-16 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center text-3xl mb-4 text-primary">
            📦
          </div>
          <h3 className="text-txt-1 font-extrabold text-lg mb-1">Hozircha buyurtmalar yo'q</h3>
          <p className="text-txt-2 text-sm max-w-xs mb-6">
            Tezkor Taom menyusidan sara taomlarni tanlang va birinchi buyurtmangizni bering!
          </p>
          <button
            onClick={() => navigate('home')}
            className="bg-primary text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-sm active:scale-95 transition-transform"
          >
            🍽 Menyuni ko'rish
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface-2 min-h-full">
      <div className="bg-surface px-5 pt-12 pb-4 flex items-center gap-4">
        <button onClick={() => navigate('profile')} className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-2">
          <ArrowLeft size={20} className="text-txt-1" />
        </button>
        <h1 className="text-txt-1 font-extrabold text-xl">Mening buyurtmalarim</h1>
      </div>
      <div className="px-4 pt-3 pb-4 space-y-3">
        {displayOrders.map(order => {
          const s = STATUS_MAP[order.status]
          return (
            <div key={order.id} className="bg-surface rounded-2xl border border-bdr overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-txt-2 text-xs">Buyurtma raqami</div>
                    <div className="text-txt-1 font-extrabold text-lg tracking-wide">#{order.number}</div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${s.color}`}>{s.label}</span>
                </div>
                <div className="text-txt-2 text-xs mb-2">{order.date}</div>
                <div className="flex items-center gap-2 mb-3">
                  {order.items.slice(0, 3).map((item, i) => (
                    <div key={i} className="w-10 h-10 rounded-xl overflow-hidden bg-surface-3">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center">
                      <span className="text-txt-2 text-xs font-bold">+{order.items.length - 3}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-primary font-extrabold">{formatPrice(order.total)}</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setViewingOrder(order); navigate('order-detail') }}
                      className="text-txt-2 text-xs font-semibold border border-bdr px-3 py-1.5 rounded-full"
                    >
                      Batafsil
                    </button>
                    <button
                      onClick={() => {
                        order.items.forEach(item => addToCart(item))
                        showToast('✓ Mahsulotlar savatchaga qo\'shildi')
                      }}
                      className="text-white text-xs font-bold bg-primary px-3 py-1.5 rounded-full flex items-center gap-1"
                    >
                      <Repeat2 size={12} />
                      Qayta
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ---- Order Detail ----

interface OrderDetailProps {
  navigate: AppProps['navigate']
  viewingOrder: AppProps['viewingOrder']
  addToCart: AppProps['addToCart']
  showToast: AppProps['showToast']
}

export function OrderDetailScreen({ navigate, viewingOrder, addToCart, showToast }: OrderDetailProps) {
  if (!viewingOrder) return null
  const s = STATUS_MAP[viewingOrder.status]

  return (
    <div className="bg-surface-2 min-h-full">
      <div className="bg-surface px-5 pt-12 pb-4 flex items-center gap-4">
        <button onClick={() => navigate('order-history')} className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-2">
          <ArrowLeft size={20} className="text-txt-1" />
        </button>
        <div>
          <h1 className="text-txt-1 font-extrabold text-xl">#{viewingOrder.number}</h1>
          <div className="text-txt-2 text-xs">{viewingOrder.date}</div>
        </div>
        <span className={`ml-auto text-xs font-bold px-3 py-1 rounded-full ${s.color}`}>{s.label}</span>
      </div>
      <div className="px-4 pt-3 pb-4 space-y-3">
        <div className="bg-surface rounded-2xl p-4 border border-bdr">
          <h3 className="text-txt-1 font-bold text-sm mb-3">Mahsulotlar</h3>
          <div className="space-y-3">
            {viewingOrder.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-surface-3">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="text-txt-1 font-semibold text-sm">{item.product.name}</div>
                  {item.extras.length > 0 && <div className="text-txt-2 text-xs">{item.extras.join(', ')}</div>}
                  <div className="text-txt-2 text-xs">×{item.quantity}</div>
                </div>
                <div className="text-txt-1 font-bold text-sm">{formatPrice(item.totalPrice)}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-surface rounded-2xl p-4 border border-bdr">
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-txt-2">Mahsulotlar</span><span className="text-txt-1 font-semibold">{formatPrice(viewingOrder.subtotal)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-txt-2">Yetkazib berish</span><span className="text-txt-1 font-semibold">{formatPrice(viewingOrder.deliveryFee)}</span></div>
            {viewingOrder.discount > 0 && (
              <div className="flex justify-between text-sm"><span className="text-txt-2">Chegirma</span><span className="text-success font-semibold">-{formatPrice(viewingOrder.discount)}</span></div>
            )}
            <div className="h-px bg-bdr" />
            <div className="flex justify-between"><span className="text-txt-1 font-bold">Jami</span><span className="text-primary font-extrabold text-lg">{formatPrice(viewingOrder.total)}</span></div>
          </div>
        </div>
        <div className="bg-surface rounded-2xl p-4 border border-bdr">
          <h3 className="text-txt-1 font-bold text-sm mb-2">Manzil</h3>
          <div className="flex items-start gap-2">
            <MapPin size={14} className="text-txt-2 mt-0.5 flex-shrink-0" />
            <span className="text-txt-1 text-sm">{viewingOrder.address}</span>
          </div>
        </div>
        <button
          onClick={() => {
            viewingOrder.items.forEach(item => addToCart(item))
            showToast('✓ Mahsulotlar savatchaga qo\'shildi')
            navigate('cart')
          }}
          className="w-full bg-primary text-white font-bold text-base py-4 rounded-2xl flex items-center justify-center gap-2"
        >
          <Repeat2 size={18} />
          Qayta buyurtma qilish
        </button>
      </div>
    </div>
  )
}

// ---- Favorites ----

interface FavoritesProps {
  navigate: AppProps['navigate']
  favorites: AppProps['favorites']
  toggleFavorite: AppProps['toggleFavorite']
  addToCart: AppProps['addToCart']
  showToast: AppProps['showToast']
  setSelectedProduct: AppProps['setSelectedProduct']
}

export function FavoritesScreen({ navigate, favorites, toggleFavorite, addToCart, showToast, setSelectedProduct }: FavoritesProps) {
  const favProducts = PRODUCTS.filter(p => favorites.includes(p.id))

  return (
    <div className="bg-surface-2 min-h-full">
      <div className="bg-surface px-5 pt-12 pb-4 flex items-center gap-4">
        <button onClick={() => navigate('profile')} className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-2">
          <ArrowLeft size={20} className="text-txt-1" />
        </button>
        <h1 className="text-txt-1 font-extrabold text-xl">Sevimlilar</h1>
      </div>
      {favProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
          <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center mb-5">
            <Heart size={36} className="text-primary" />
          </div>
          <h2 className="text-txt-1 font-bold text-lg mb-2">Hali sevimlilar yo'q</h2>
          <p className="text-txt-2 text-sm mb-6">Yoqtirgan taomlaringizni sevimlilarga qo'shing.</p>
          <button onClick={() => navigate('catalog')} className="bg-primary text-white font-bold px-6 py-3 rounded-2xl">
            Taomlarni ko'rish
          </button>
        </div>
      ) : (
        <div className="px-4 pt-3 pb-4 space-y-2">
          {favProducts.map(product => (
            <div key={product.id} className="bg-surface rounded-2xl border border-bdr flex items-center gap-3 p-3">
              <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-surface-3 cursor-pointer" onClick={() => setSelectedProduct(product)}>
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-txt-1 font-bold text-sm line-clamp-1">{product.name}</div>
                <div className="text-primary font-bold text-sm mt-0.5">{formatPrice(product.price)}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { toggleFavorite(product.id); showToast('✓ Sevimlilardan olib tashlandi') }}
                  className="w-9 h-9 bg-err-light rounded-full flex items-center justify-center"
                >
                  <Heart size={16} className="text-err fill-err" />
                </button>
                <button
                  onClick={() => { addToCart({ product, quantity: 1, extras: [], totalPrice: product.price }); }}
                  className="w-9 h-9 bg-primary rounded-full flex items-center justify-center"
                >
                  <Plus size={16} className="text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ---- Addresses ----

interface AddressesProps {
  navigate: AppProps['navigate']
}

const ADDRESSES = [
  { id: '1', type: 'Uy', icon: '🏠', address: "Chilonzor tumani, Bunyodkor ko'chasi 12, 34-xonadon" },
  { id: '2', type: 'Ish', icon: '🏢', address: "Yunusobod tumani, Amir Temur ko'chasi 5, 2-qavat" },
]

export function AddressesScreen({ navigate }: AddressesProps) {
  return (
    <div className="bg-surface-2 min-h-full">
      <div className="bg-surface px-5 pt-12 pb-4 flex items-center gap-4">
        <button onClick={() => navigate('profile')} className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-2">
          <ArrowLeft size={20} className="text-txt-1" />
        </button>
        <h1 className="text-txt-1 font-extrabold text-xl">Manzillar</h1>
      </div>
      <div className="px-4 pt-3 pb-4 space-y-3">
        {ADDRESSES.map(addr => (
          <div key={addr.id} className="bg-surface rounded-2xl border border-bdr p-4 flex items-start gap-3">
            <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center text-lg flex-shrink-0">
              {addr.icon}
            </div>
            <div className="flex-1">
              <div className="text-txt-1 font-bold text-sm">{addr.type}</div>
              <div className="text-txt-2 text-xs leading-relaxed mt-0.5">{addr.address}</div>
            </div>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-err-light">
              <Trash2 size={14} className="text-err" />
            </button>
          </div>
        ))}
        <button className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-primary/30 text-primary font-bold py-4 rounded-2xl bg-primary-light/50">
          <Plus size={18} />
          Yangi manzil
        </button>
      </div>
    </div>
  )
}

// ---- Notifications ----

interface NotificationsProps {
  navigate: AppProps['navigate']
}

const NOTIFS = [
  { icon: '🎉', text: '#A7K29 buyurtmangiz yetkazildi.', time: 'Bugun, 15:10', read: false },
  { icon: '🚚', text: '#A7K29 kuryerga berildi.', time: 'Bugun, 14:55', read: false },
  { icon: '👨‍🍳', text: '#A7K29 tayyorlanmoqda.', time: 'Bugun, 14:40', read: true },
  { icon: '✅', text: '#A7K29 buyurtmangiz qabul qilindi.', time: 'Bugun, 14:32', read: true },
  { icon: '🎁', text: 'Yangi aksiya! 25% chegirma mavjud.', time: 'Kecha, 18:00', read: true },
]

export function NotificationsScreen({ navigate }: NotificationsProps) {
  return (
    <div className="bg-surface-2 min-h-full">
      <div className="bg-surface px-5 pt-12 pb-4 flex items-center gap-4">
        <button onClick={() => navigate('profile')} className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-2">
          <ArrowLeft size={20} className="text-txt-1" />
        </button>
        <h1 className="text-txt-1 font-extrabold text-xl">Bildirishnomalar</h1>
      </div>
      <div className="px-4 pt-3 pb-4 space-y-2">
        {NOTIFS.map((n, i) => (
          <div key={i} className={`bg-surface rounded-2xl border p-4 flex items-start gap-3 ${n.read ? 'border-bdr' : 'border-primary/30 bg-primary-light/30'}`}>
            <div className="w-10 h-10 bg-surface-2 rounded-full flex items-center justify-center text-xl flex-shrink-0">
              {n.icon}
            </div>
            <div className="flex-1">
              <div className={`text-sm leading-relaxed ${n.read ? 'text-txt-2' : 'text-txt-1 font-medium'}`}>{n.text}</div>
              <div className="text-txt-3 text-xs mt-1">{n.time}</div>
            </div>
            {!n.read && <div className="w-2 h-2 bg-primary rounded-full mt-1 flex-shrink-0" />}
          </div>
        ))}
      </div>
    </div>
  )
}

// ---- Help ----

interface HelpProps {
  navigate: AppProps['navigate']
}

export function HelpScreen({ navigate }: HelpProps) {
  return (
    <div className="bg-surface-2 min-h-full">
      <div className="bg-surface px-5 pt-12 pb-4 flex items-center gap-4">
        <button onClick={() => navigate('profile')} className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-2">
          <ArrowLeft size={20} className="text-txt-1" />
        </button>
        <h1 className="text-txt-1 font-extrabold text-xl">Yordam va Aloqa</h1>
      </div>
      <div className="px-4 pt-3 pb-4 space-y-3">
        <a
          href="tel:+998336755550"
          className="w-full bg-surface rounded-2xl border border-bdr p-4 flex items-center gap-4 text-left shadow-xs hover:border-primary transition-colors block"
        >
          <div className="w-12 h-12 bg-primary-light rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 text-primary">
            📞
          </div>
          <div className="flex-1">
            <div className="text-txt-1 font-bold text-sm">Buyurtma va Operator</div>
            <div className="text-primary font-bold text-xs mt-0.5">(33) 675-55-50</div>
            <div className="text-txt-3 text-[11px]">Ish vaqti: Har kuni 09:00 – 23:00</div>
          </div>
          <ChevronRight size={16} className="text-txt-3" />
        </a>

        <a
          href="https://t.me/tezkorburger"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-surface rounded-2xl border border-bdr p-4 flex items-center gap-4 text-left shadow-xs hover:border-primary transition-colors block"
        >
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
            ✈️
          </div>
          <div className="flex-1">
            <div className="text-txt-1 font-bold text-sm">Telegram kanal va qo'llab-quvvatlash</div>
            <div className="text-blue-600 font-bold text-xs mt-0.5">@tezkorburger</div>
            <div className="text-txt-3 text-[11px]">Yangiliklar, aksiyalar va tezkor yordam</div>
          </div>
          <ChevronRight size={16} className="text-txt-3" />
        </a>

        <div className="bg-surface rounded-2xl border border-bdr p-4 flex items-center gap-4 text-left">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
            ⚡
          </div>
          <div className="flex-1">
            <div className="text-txt-1 font-bold text-sm">Yetkazib berish xizmati</div>
            <div className="text-txt-2 text-xs mt-0.5">Namangan shahri bo'ylab yetkazib berish: 10 000 so'm</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---- Profile Main ----

interface ProfileProps {
  navigate: AppProps['navigate']
  user?: AppProps['user']
  orders?: AppProps['orders']
  favoritesCount?: number
  userPhone?: string
  userLocation?: string
}

const MENU_ITEMS = [
  { icon: '📜', label: 'Mening buyurtmalarim', screen: 'order-history' as const },
  { icon: '❤️', label: 'Sevimlilar', screen: 'favorites' as const },
  { icon: '📍', label: 'Manzillar', screen: 'addresses' as const },
  { icon: '❓', label: 'Yordam', screen: 'help' as const },
]

export default function ProfileScreen({ navigate, user, orders, favoritesCount, userPhone, userLocation }: ProfileProps) {
  const displayName = user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : 'Foydalanuvchi'
  const displayContact = userPhone || (user?.username ? `@${user.username}` : (user?.id ? `ID: ${user.id}` : 'Tezkor Taom a\'zosi'))
  const orderCount = orders ? orders.length : 0

  return (
    <div className="bg-surface-2 min-h-full">
      <div className="bg-surface px-5 pt-12 pb-6">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-txt-1 font-extrabold text-2xl">Profil</h1>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light border border-primary/20">
            <img src="/logo.jpg" alt="Tezkor Taom" className="w-5 h-5 rounded-full object-cover" />
            <span className="text-primary text-xs font-bold tracking-tight">Tezkor Taom</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-primary-light border-2 border-primary/20 flex items-center justify-center shadow-xs">
            {user?.photo_url ? (
              <img
                src={user.photo_url}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-orange-600 text-white font-black text-2xl flex items-center justify-center">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <div className="text-txt-1 font-extrabold text-xl">{displayName}</div>
            <div className="text-txt-2 text-sm">{displayContact}</div>
            {userLocation && (
              <div className="text-txt-3 text-xs flex items-center gap-1 mt-0.5">
                <MapPin size={11} className="text-primary" />
                <span className="truncate max-w-[180px]">{userLocation}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <div className="flex-1 bg-primary-light rounded-2xl p-3 text-center">
            <div className="text-primary font-extrabold text-2xl">{orderCount}</div>
            <div className="text-txt-2 text-xs mt-0.5">Buyurtmalar</div>
          </div>
          <div className="flex-1 bg-primary-light rounded-2xl p-3 text-center">
            <div className="text-primary font-extrabold text-2xl">{favoritesCount ?? 4}</div>
            <div className="text-txt-2 text-xs mt-0.5">Sevimlilar</div>
          </div>
          <div className="flex-1 bg-primary-light rounded-2xl p-3 text-center">
            <div className="text-primary font-extrabold text-2xl">⭐ 5</div>
            <div className="text-txt-2 text-xs mt-0.5">Reyting</div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 pb-4 space-y-2">
        {MENU_ITEMS.map(item => (
          <button
            key={item.screen}
            onClick={() => navigate(item.screen)}
            className="w-full bg-surface rounded-2xl border border-bdr px-4 py-4 flex items-center gap-4 text-left"
          >
            <span className="text-xl">{item.icon}</span>
            <span className="flex-1 text-txt-1 font-semibold">{item.label}</span>
            <ChevronRight size={16} className="text-txt-3" />
          </button>
        ))}
      </div>
    </div>
  )
}
