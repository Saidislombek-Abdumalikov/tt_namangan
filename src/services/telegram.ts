// Telegram WebApp service helper

export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  photo_url?: string
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string
        initDataUnsafe: {
          user?: TelegramUser
          query_id?: string
          auth_date?: number
          hash?: string
        }
        version: string
        platform: string
        colorScheme: 'light' | 'dark'
        isExpanded: boolean
        viewportHeight: number
        viewportStableHeight: number
        BackButton: {
          isVisible: boolean
          show: () => void
          hide: () => void
          onClick: (cb: () => void) => void
          offClick: (cb: () => void) => void
        }
        MainButton: {
          text: string
          color: string
          textColor: string
          isVisible: boolean
          isActive: boolean
          isProgressVisible: boolean
          setText: (text: string) => void
          onClick: (cb: () => void) => void
          offClick: (cb: () => void) => void
          show: () => void
          hide: () => void
          enable: () => void
          disable: () => void
          showProgress: (leaveActive?: boolean) => void
          hideProgress: () => void
        }
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void
          selectionChanged: () => void
        }
        ready: () => void
        expand: () => void
        close: () => void
        sendData: (data: string) => void
        openLink: (url: string) => void
        openTelegramLink: (url: string) => void
      }
    }
  }
}

export const getTelegramWebApp = () => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp
  }
  return null
}

export const initTelegramWebApp = () => {
  const tg = getTelegramWebApp()
  if (tg) {
    try {
      tg.ready()
      tg.expand()
    } catch (e) {
      console.warn('Telegram WebApp init warning:', e)
    }
  }
}

export const getTelegramUser = (): TelegramUser | null => {
  const tg = getTelegramWebApp()
  return tg?.initDataUnsafe?.user || null
}

export const getTelegramInitData = (): string => {
  const tg = getTelegramWebApp()
  return tg?.initData || ''
}

export const triggerHaptic = (type: 'impact' | 'notification' | 'selection', param?: string) => {
  const tg = getTelegramWebApp()
  if (!tg?.HapticFeedback) return

  try {
    if (type === 'impact') {
      tg.HapticFeedback.impactOccurred((param as 'light' | 'medium' | 'heavy') || 'medium')
    } else if (type === 'notification') {
      tg.HapticFeedback.notificationOccurred((param as 'error' | 'success' | 'warning') || 'success')
    } else if (type === 'selection') {
      tg.HapticFeedback.selectionChanged()
    }
  } catch (e) {
    // Ignore if not supported in environment
  }
}

export interface TelegramLaunchData {
  phone?: string
  address?: string
  lat?: number
  lng?: number
  name?: string
}

export const getTelegramLaunchData = (): TelegramLaunchData => {
  if (typeof window === 'undefined') return {}

  const result: TelegramLaunchData = {}

  // 1. Try URL search params (?phone=...&address=...&lat=...&lng=...)
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const phone = urlParams.get('phone')
    const address = urlParams.get('address') || urlParams.get('loc') || urlParams.get('location')
    const lat = urlParams.get('lat')
    const lng = urlParams.get('lng')
    const name = urlParams.get('name')

    if (phone) result.phone = phone
    if (address) result.address = decodeURIComponent(address)
    if (lat && !isNaN(Number(lat))) result.lat = Number(lat)
    if (lng && !isNaN(Number(lng))) result.lng = Number(lng)
    if (name) result.name = decodeURIComponent(name)
  } catch (e) {
    console.warn('Failed parsing URL launch params:', e)
  }

  // 2. Try start_param from Telegram WebApp initDataUnsafe
  try {
    const tg = getTelegramWebApp()
    const startParam = (tg?.initDataUnsafe as any)?.start_param
    if (startParam && typeof startParam === 'string') {
      // Check if start_param is encoded or key_value (e.g. loc_Namangan or p_998901234567)
      if (startParam.startsWith('loc_')) {
        result.address = decodeURIComponent(startParam.slice(4).replace(/_/g, ' '))
      } else if (startParam.startsWith('p_')) {
        result.phone = '+' + startParam.slice(2)
      }
    }
  } catch (e) {
    console.warn('Failed parsing start_param:', e)
  }

  // 3. Fallback to persisted localStorage values
  try {
    if (!result.phone) {
      const savedPhone = localStorage.getItem('tt_user_phone')
      if (savedPhone) result.phone = savedPhone
    }
    if (!result.address) {
      const savedAddr = localStorage.getItem('tt_user_address')
      if (savedAddr) result.address = savedAddr
    }
  } catch (e) {
    // Ignore
  }

  // Persist any newly found values
  if (result.phone) localStorage.setItem('tt_user_phone', result.phone)
  if (result.address) localStorage.setItem('tt_user_address', result.address)
  if (result.lat) localStorage.setItem('tt_user_lat', String(result.lat))
  if (result.lng) localStorage.setItem('tt_user_lng', String(result.lng))

  return result
}

