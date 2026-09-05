import { useState, useCallback, useEffect } from 'react'
import type { Screen, CartItem, Order, Product } from './types'
import { MOCK_ORDERS } from './data'
import { api } from './services/api'
import BottomNav from './components/BottomNav'
import Toast from './components/Toast'
import ProductSheet from './components/ProductSheet'
import Onboarding from './screens/Onboarding'
import Home from './screens/Home'
import Catalog from './screens/Catalog'
import SearchScreen from './screens/Search'
import Cart from './screens/Cart'
import Checkout from './screens/Checkout'
import OrderSuccess from './screens/OrderSuccess'
import OrderTracking from './screens/OrderTracking'
import ProfileScreen, {
  OrderHistoryScreen,
  OrderDetailScreen,
  FavoritesScreen,
  AddressesScreen,
  NotificationsScreen,
  HelpScreen,
} from './screens/Profile'
import {
  initTelegramWebApp,
  getTelegramUser,
  getTelegramWebApp,
  triggerHaptic,
  getTelegramLaunchData,
  type TelegramUser,
  type TelegramLaunchData,
} from './services/telegram'

const TABS_WITH_NAV: Screen[] = [
  'home',
  'catalog',
  'cart',
  'profile',
  'order-history',
  'order-detail',
  'favorites',
  'addresses',
  'notifications',
  'help',
]

const getItemKey = (productId: string, extras: string[] = []) =>
  `${productId}::${[...extras].sort().join(',')}`

export default function App() {
  const [user, setUser] = useState<TelegramUser | null>(null)
  const [launchData, setLaunchData] = useState<TelegramLaunchData>(() => getTelegramLaunchData())

  // Initialize screen based on onboarding completion in localStorage
  const [screen, setScreen] = useState<Screen>(() => {
    return 'home'
  })

  const [tab, setTab] = useState<'home' | 'catalog' | 'cart' | 'profile'>('home')

  // Cart state with localStorage persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('tt_cart')
        if (saved) return JSON.parse(saved)
      } catch (e) {
        console.warn('Failed to parse saved cart', e)
      }
    }
    return []
  })

  // Favorites state with localStorage persistence
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('tt_favorites')
        if (saved) return JSON.parse(saved)
      } catch (e) {
        console.warn('Failed to parse saved favorites', e)
      }
    }
    return []
  })

  // Orders state with localStorage persistence
  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('tt_orders')
        if (saved) return JSON.parse(saved)
      } catch (e) {
        console.warn('Failed to parse saved orders', e)
      }
    }
    return []
  })

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null)

  // Initialize Telegram WebApp and Real Account Data
  useEffect(() => {
    initTelegramWebApp()
    const tgUser = getTelegramUser()
    if (tgUser) {
      setUser(tgUser)
      // Authenticate with backend
      const initData = getTelegramInitData()
      if (initData) {
        api.loginWithTelegram(initData).catch(() => {})
      }
      // Load real orders for this account
      api.getUserOrders(tgUser.id, launchData.phone).then(realOrders => {
        if (realOrders && realOrders.length > 0) {
          setOrders(realOrders)
        }
      })
    }
    const data = getTelegramLaunchData()
    setLaunchData(data)
  }, [])

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tt_cart', JSON.stringify(cart))
    } catch (e) {
      // Ignore
    }
  }, [cart])

  // Sync favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tt_favorites', JSON.stringify(favorites))
    } catch (e) {
      // Ignore
    }
  }, [favorites])

  // Sync orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tt_orders', JSON.stringify(orders))
    } catch (e) {
      // Ignore
    }
  }, [orders])

  // Telegram BackButton management
  useEffect(() => {
    const tg = getTelegramWebApp()
    if (!tg?.BackButton) return

    if (screen !== 'home' && screen !== 'onboarding') {
      tg.BackButton.show()
      const handleBack = () => {
        triggerHaptic('selection')
        if (screen === 'order-detail') {
          setScreen('order-history')
        } else if (
          ['order-history', 'favorites', 'addresses', 'notifications', 'help'].includes(screen)
        ) {
          setScreen('profile')
          setTab('profile')
        } else if (screen === 'checkout') {
          setScreen('cart')
        } else if (screen === 'search') {
          setScreen('home')
        } else {
          setScreen('home')
          setTab('home')
        }
      }
      tg.BackButton.onClick(handleBack)
      return () => {
        tg.BackButton.offClick(handleBack)
      }
    } else {
      tg.BackButton.hide()
    }
  }, [screen])

  const navigate = useCallback((s: Screen) => {
    setScreen(s)
    if (s === 'home' || s === 'catalog' || s === 'cart' || s === 'profile') {
      setTab(s)
    }
  }, [])

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    triggerHaptic('notification', 'success')
    setTimeout(() => setToast(null), 2800)
  }, [])

  const addToCart = useCallback(
    (item: CartItem) => {
      setCart(prev => {
        const key = getItemKey(item.product.id, item.extras)
        const existingIdx = prev.findIndex(i => getItemKey(i.product.id, i.extras) === key)
        if (existingIdx > -1) {
          return prev.map((i, idx) =>
            idx === existingIdx
              ? {
                  ...i,
                  quantity: i.quantity + item.quantity,
                  totalPrice: i.totalPrice + item.totalPrice,
                }
              : i
          )
        }
        return [...prev, item]
      })
      triggerHaptic('impact', 'light')
      showToast(`✓ ${item.product.name} savatchaga qo'shildi`)
    },
    [showToast]
  )

  const removeFromCart = useCallback((productId: string, extras?: string[]) => {
    setCart(prev => {
      if (extras) {
        const key = getItemKey(productId, extras)
        return prev.filter(i => getItemKey(i.product.id, i.extras) !== key)
      }
      return prev.filter(i => i.product.id !== productId)
    })
    triggerHaptic('impact', 'medium')
  }, [])

  const updateQuantity = useCallback(
    (productId: string, qty: number, extras?: string[]) => {
      if (qty <= 0) {
        removeFromCart(productId, extras)
        return
      }
      setCart(prev => {
        const key = extras ? getItemKey(productId, extras) : null
        return prev.map(i => {
          const matches = key
            ? getItemKey(i.product.id, i.extras) === key
            : i.product.id === productId
          if (matches) {
            const unitPrice = i.totalPrice / i.quantity
            return { ...i, quantity: qty, totalPrice: unitPrice * qty }
          }
          return i
        })
      })
      triggerHaptic('selection')
    },
    [removeFromCart]
  )

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites(prev => {
      const isFav = prev.includes(productId)
      triggerHaptic('impact', 'light')
      return isFav ? prev.filter(id => id !== productId) : [...prev, productId]
    })
  }, [])

  const handleTabChange = useCallback((t: 'home' | 'catalog' | 'cart' | 'profile') => {
    triggerHaptic('selection')
    setTab(t)
    setScreen(t)
  }, [])

  const finishOnboarding = useCallback(() => {
    localStorage.setItem('tt_onboarding_done', 'true')
    setScreen('home')
    setTab('home')
  }, [])

  const addOrder = useCallback((newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev])
  }, [])

  const cartCount = cart.reduce((a, b) => a + b.quantity, 0)
  const showNav = TABS_WITH_NAV.includes(screen)

  return (
    <div className="flex justify-center h-screen h-[100dvh] bg-surface-3 overflow-hidden select-none">
      <div
        className="relative w-full h-full bg-surface flex flex-col overflow-hidden shadow-2xl"
        style={{ maxWidth: 390 }}
      >
        <div className={`flex-1 overflow-y-auto overscroll-contain ${showNav ? 'pb-20' : 'pb-4'}`}>
          {screen === 'onboarding' && (
            <Onboarding
              navigate={navigate}
              handleTabChange={handleTabChange}
              onFinish={finishOnboarding}
            />
          )}
          {screen === 'home' && (
            <Home
              navigate={navigate}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              setSelectedProduct={setSelectedProduct}
              addToCart={addToCart}
              showToast={showToast}
              handleTabChange={handleTabChange}
              user={user}
              userLocation={launchData.address}
            />
          )}
          {screen === 'catalog' && (
            <Catalog
              navigate={navigate}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              setSelectedProduct={setSelectedProduct}
              addToCart={addToCart}
              showToast={showToast}
            />
          )}
          {screen === 'search' && (
            <SearchScreen
              navigate={navigate}
              setSelectedProduct={setSelectedProduct}
              addToCart={addToCart}
            />
          )}
          {screen === 'cart' && (
            <Cart
              navigate={navigate}
              cart={cart}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
              addToCart={addToCart}
              showToast={showToast}
              handleTabChange={handleTabChange}
            />
          )}
          {screen === 'checkout' && (
            <Checkout
              navigate={navigate}
              cart={cart}
              setCurrentOrder={setCurrentOrder}
              showToast={showToast}
              user={user}
              addOrder={addOrder}
              userLocation={launchData.address}
              userPhone={launchData.phone}
            />
          )}
          {screen === 'order-success' && (
            <OrderSuccess
              navigate={navigate}
              currentOrder={currentOrder}
              handleTabChange={handleTabChange}
            />
          )}
          {screen === 'order-tracking' && (
            <OrderTracking navigate={navigate} currentOrder={currentOrder} />
          )}
          {screen === 'profile' && (
            <ProfileScreen
              navigate={navigate}
              user={user}
              orders={orders}
              favoritesCount={favorites.length}
              userPhone={launchData.phone}
              userLocation={launchData.address}
            />
          )}
          {screen === 'order-history' && (
            <OrderHistoryScreen
              navigate={navigate}
              setViewingOrder={setViewingOrder}
              addToCart={addToCart}
              showToast={showToast}
              orders={orders}
            />
          )}
          {screen === 'order-detail' && (
            <OrderDetailScreen
              navigate={navigate}
              viewingOrder={viewingOrder}
              addToCart={addToCart}
              showToast={showToast}
            />
          )}
          {screen === 'favorites' && (
            <FavoritesScreen
              navigate={navigate}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              addToCart={addToCart}
              showToast={showToast}
              setSelectedProduct={setSelectedProduct}
            />
          )}
          {screen === 'addresses' && <AddressesScreen navigate={navigate} />}
          {screen === 'notifications' && <NotificationsScreen navigate={navigate} />}
          {screen === 'help' && <HelpScreen navigate={navigate} />}
        </div>

        {showNav && (
          <div className="absolute bottom-0 left-0 right-0 z-40 bg-surface">
            <BottomNav tab={tab} onTabChange={handleTabChange} cartCount={cartCount} />
          </div>
        )}

        {selectedProduct && (
          <ProductSheet
            product={selectedProduct}
            isFavorite={favorites.includes(selectedProduct.id)}
            onClose={() => setSelectedProduct(null)}
            onAdd={item => {
              addToCart(item)
            }}
            onToggleFavorite={id => {
              toggleFavorite(id)
              showToast(
                favorites.includes(id)
                  ? '✓ Sevimlilardan olib tashlandi'
                  : "✓ Sevimlilarga qo'shildi"
              )
            }}
          />
        )}

        {toast && <Toast message={toast} />}
      </div>
    </div>
  )
}
