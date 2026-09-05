import type { TelegramUser } from './services/telegram'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  oldPrice?: number
  discount?: number
  category: string
  image: string
  ingredients?: string[]
  extras?: { name: string; price: number }[]
  inStock: boolean
}

export interface CartItem {
  product: Product
  quantity: number
  extras: string[]
  totalPrice: number
}

export interface Order {
  id: string
  number: string
  date: string
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  discount: number
  total: number
  status: 'pending' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled'
  address: string
  courier?: string
  phone?: string
  note?: string
}

export type Screen =
  | 'onboarding'
  | 'home'
  | 'catalog'
  | 'cart'
  | 'checkout'
  | 'order-success'
  | 'order-tracking'
  | 'profile'
  | 'order-history'
  | 'order-detail'
  | 'favorites'
  | 'addresses'
  | 'notifications'
  | 'help'
  | 'search'

export interface AppProps {
  navigate: (screen: Screen) => void
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (productId: string, extras?: string[]) => void
  updateQuantity: (productId: string, qty: number, extras?: string[]) => void
  favorites: string[]
  toggleFavorite: (productId: string) => void
  setSelectedProduct: (product: Product | null) => void
  showToast: (msg: string) => void
  currentOrder: Order | null
  setCurrentOrder: (order: Order | null) => void
  viewingOrder: Order | null
  setViewingOrder: (order: Order | null) => void
  tab: 'home' | 'catalog' | 'cart' | 'profile'
  handleTabChange: (tab: 'home' | 'catalog' | 'cart' | 'profile') => void
  user?: TelegramUser | null
  orders?: Order[]
  addOrder?: (order: Order) => void
  userLocation?: string
  userPhone?: string
  products?: Product[]
  categories?: any[]
}

