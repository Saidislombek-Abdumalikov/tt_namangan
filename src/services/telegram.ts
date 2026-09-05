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
  let user: TelegramUser | null = null

  // 1. Direct Telegram WebApp object
  const tg = getTelegramWebApp()
  if (tg?.initDataUnsafe?.user?.first_name) {
    const u = tg.initDataUnsafe.user
    user = {
      id: u.id,
      first_name: u.first_name,
      last_name: u.last_name,
      username: u.username,
      language_code: u.language_code,
      photo_url: u.photo_url,
    }
  }

  // 2. Parse initData query string if initDataUnsafe wasn't populated yet
  if (!user && tg?.initData) {
    try {
      const searchParams = new URLSearchParams(tg.initData)
      const userJson = searchParams.get('user')
      if (userJson) {
        const u = JSON.parse(userJson)
        if (u.first_name) {
          user = {
            id: u.id,
            first_name: u.first_name,
            last_name: u.last_name,
            username: u.username,
            language_code: u.language_code,
            photo_url: u.photo_url,
          }
        }
      }
    } catch {}
  }

  // 3. Telegram Web (hash parameters #tgWebAppData=...)
  if (!user && typeof window !== 'undefined' && window.location.hash) {
    try {
      const hash = window.location.hash.substring(1)
      const hashParams = new URLSearchParams(hash)
      const tgWebAppData = hashParams.get('tgWebAppData') || hash
      const dataParams = new URLSearchParams(tgWebAppData)
      const userJson = dataParams.get('user')
      if (userJson) {
        const u = JSON.parse(userJson)
        if (u.first_name) {
          user = {
            id: u.id,
            first_name: u.first_name,
            last_name: u.last_name,
            username: u.username,
            language_code: u.language_code,
            photo_url: u.photo_url,
          }
        }
      }
    } catch {}
  }

  // 4. URL query parameters passed by Telegram Bot (?tg_id=...&first_name=...&username=...)
  if (!user && typeof window !== 'undefined' && window.location.search) {
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const firstName = urlParams.get('first_name') || urlParams.get('name')
      if (firstName) {
        const tgId = urlParams.get('tg_id') || urlParams.get('id')
        user = {
          id: tgId ? Number(tgId) : 1001,
          first_name: decodeURIComponent(firstName),
          last_name: urlParams.get('last_name') ? decodeURIComponent(urlParams.get('last_name')!) : undefined,
          username: urlParams.get('username') ? decodeURIComponent(urlParams.get('username')!) : undefined,
          photo_url: urlParams.get('photo_url') || undefined,
        }
      }
    } catch {}
  }

  // 5. Persisted user in localStorage
  if (!user && typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('tt_telegram_user')
      if (saved) {
        user = JSON.parse(saved)
      }
    } catch {}
  }

  // Save for future offline/reloads
  if (user && typeof window !== 'undefined') {
    try {
      localStorage.setItem('tt_telegram_user', JSON.stringify(user))
    } catch {}
  }

  return user
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

    if (phone) {
      let clean = phone.trim()
      if (clean.startsWith(' ')) clean = '+' + clean.trim()
      clean = clean.replace(/[^\d+]/g, '')
      if (!clean.startsWith('+') && clean.length >= 9) clean = '+' + clean
      result.phone = clean
    }
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
        let p = startParam.slice(2).replace(/[^\d+]/g, '')
        if (!p.startsWith('+')) p = '+' + p
        result.phone = p
      }
    }
  } catch (e) {
    console.warn('Failed parsing start_param:', e)
  }

  // 3. Fallback to persisted localStorage values
  try {
    if (!result.phone) {
      const savedPhone = localStorage.getItem('tt_user_phone')
      if (savedPhone) {
        let clean = savedPhone.trim().replace(/^ /, '+').replace(/[^\d+]/g, '')
        if (!clean.startsWith('+') && clean.length >= 9) clean = '+' + clean
        result.phone = clean
      }
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

