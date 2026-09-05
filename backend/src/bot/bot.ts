import { Bot, Keyboard, InlineKeyboard } from 'grammy'
import fs from 'fs'
import path from 'path'
import { config } from '../config'
import { prisma } from '../database'
import { OrderService } from '../services/orderService'
import { TelegramNotifier, getOrderKeyboard, formatOrderMessage, setResolvedChatId } from '../services/telegramNotifier'
import { OrderStatus } from '@prisma/client'

// Instantiate bot with token
export const bot = new Bot(config.botToken || '8934194891:AAEMFHYLIUaQjLT40QgfS5X8tGOtAoGHjlE')

// Global error handler so the bot never terminates on an unhandled exception
bot.catch(err => {
  console.error(`Error in bot while handling update ${err.ctx?.update?.update_id}:`, err.error)
})

// Logging middleware
bot.use(async (ctx, next) => {
  const updateType = ctx.message
    ? `message (${ctx.message.text || 'media/contact'})`
    : ctx.callbackQuery
    ? `callback (${ctx.callbackQuery.data})`
    : 'other'
  console.log(
    `🤖 Bot update ${ctx.update.update_id} [${updateType}] from ${ctx.from?.id} (${ctx.from?.first_name || 'User'})`
  )
  await next()
})

// Persistent Local User Cache so the bot works seamlessly in any environment
export interface BotUserData {
  telegramId: number
  firstName: string
  lastName?: string
  username?: string
  phone?: string
  address?: string
  lat?: number
  lng?: number
  step?: 'awaiting_phone' | 'awaiting_location' | 'registered'
}

const DATA_DIR = process.env.VERCEL ? '/tmp/data' : path.resolve(process.cwd(), 'data')
const USERS_FILE = path.join(DATA_DIR, 'bot_users.json')

function loadBotUsers(): Record<string, BotUserData> {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const raw = fs.readFileSync(USERS_FILE, 'utf-8')
      return JSON.parse(raw)
    }
  } catch (err) {
    console.warn('Could not read bot_users.json:', err)
  }
  return {}
}

const userStore: Record<string, BotUserData> = loadBotUsers()

function saveBotUser(user: BotUserData) {
  userStore[String(user.telegramId)] = user
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(userStore, null, 2), 'utf-8')
  } catch (err) {
    // Fail silently in read-only environment
  }
}

export function buildWebAppUrl(data?: BotUserData): string {
  const baseUrl = config.webAppUrl.startsWith('https://')
    ? config.webAppUrl
    : 'https://tt-namangan.vercel.app'
  try {
    const url = new URL(baseUrl)
    if (data?.telegramId) url.searchParams.set('tg_id', String(data.telegramId))
    if (data?.firstName) url.searchParams.set('first_name', data.firstName)
    if (data?.lastName) url.searchParams.set('last_name', data.lastName)
    if (data?.username) url.searchParams.set('username', data.username)
    if (data?.phone) url.searchParams.set('phone', data.phone)
    if (data?.address) url.searchParams.set('address', data.address)
    if (data?.lat) url.searchParams.set('lat', String(data.lat))
    if (data?.lng) url.searchParams.set('lng', String(data.lng))
    return url.toString()
  } catch (e) {
    return baseUrl
  }
}

export function getPhysicalKeyboard(userData: BotUserData) {
  const webAppUrl = buildWebAppUrl(userData)
  const kb = new Keyboard()
    .webApp('🍽 Menyuni ochish (Mini App)', webAppUrl)
    .row()
    .text('📦 Buyurtmalarim')
    .text('☎️ Bog\'lanish')

  if (!userData.phone) {
    kb.row().requestContact('📱 Telefon raqamni yuborish')
  }
  if (!userData.address && !userData.lat) {
    kb.row().requestLocation('📍 Joylashuvni yuborish')
  }

  return kb.resized().persistent()
}

function getPhoneKeyboard(userData?: BotUserData) {
  const url = buildWebAppUrl(userData)
  return new Keyboard()
    .webApp('🍽 Menyuni ochish (Mini App)', url)
    .row()
    .requestContact('📱 Telefon raqamni yuborish')
    .row()
    .text('⬅️ Bekor qilish')
    .resized()
    .persistent()
}

function getLocationKeyboard(userData?: BotUserData) {
  const url = buildWebAppUrl(userData)
  return new Keyboard()
    .webApp('🍽 Menyuni ochish (Mini App)', url)
    .row()
    .requestLocation('📍 Joylashuvni yuborish')
    .row()
    .text('➡️ Keyinroq kiritish')
    .text('⬅️ Bekor qilish')
    .resized()
    .persistent()
}

function getMainMenuKeyboard(userData: BotUserData) {
  return getPhysicalKeyboard(userData)
}

function getInlineMenuKeyboard(userData: BotUserData) {
  const webAppUrl = buildWebAppUrl(userData)
  return new InlineKeyboard()
    .webApp('🍽 Menyuni ochish (Mini App)', webAppUrl)
}

// 1. /start command
bot.command('start', async ctx => {
  const user = ctx.from
  if (!user) return

  let userData = userStore[String(user.id)] || {
    telegramId: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    username: user.username,
  }

  // Always keep user details up to date
  userData.firstName = user.first_name
  userData.lastName = user.last_name || userData.lastName
  userData.username = user.username || userData.username

  // Sync to database if available
  try {
    await prisma.user.upsert({
      where: { telegramId: BigInt(user.id) },
      update: {
        firstName: user.first_name,
        lastName: user.last_name || null,
        username: user.username || null,
        phone: userData.phone || null,
      },
      create: {
        telegramId: BigInt(user.id),
        firstName: user.first_name,
        lastName: user.last_name || null,
        username: user.username || null,
        phone: userData.phone || null,
      },
    })
  } catch (err) {
    // Graceful fallback
  }

  const appUrl = buildWebAppUrl(userData)

  // Configure persistent chat menu button
  try {
    await ctx.api.setChatMenuButton({
      chat_id: user.id,
      menu_button: {
        type: 'web_app',
        text: '🍽 Menyuni ochish',
        web_app: { url: appUrl },
      },
    })
  } catch (e) {
    // Ignore if not supported
  }

  saveBotUser(userData)

  const welcomeText = `Assalomu alaykum, <b>${user.first_name}</b>! 🍽\n\n<b>«TEZKOR TAOM NAMANGAN»</b> rasmiy yetkazib berish xizmati botiga xush kelibsiz!\n\nBizda sara tandir lavashlar, mangal hot-doglar, TT burgerlar, kombo to'plamlar va milliy taomlarni to'g'ridan-to'g'ri Telegram ilovasi orqali tezkor buyurtma qilishingiz mumkin.\n\n👇 <b>Pastdagi «🍽 Menyuni ochish (Mini App)» tugmasini bosing:</b>`

  await ctx.reply(welcomeText, {
    parse_mode: 'HTML',
    reply_markup: getPhysicalKeyboard(userData),
  })
})

// 2. Handle Contact (Phone Number)
bot.on('message:contact', async ctx => {
  const contact = ctx.message.contact
  const user = ctx.from
  if (!contact || !user) return

  let phone = contact.phone_number.trim()
  if (!phone.startsWith('+')) {
    phone = '+' + phone
  }

  let userData = userStore[String(user.id)] || {
    telegramId: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    username: user.username,
  }

  userData.phone = phone
  userData.step = 'awaiting_location'
  saveBotUser(userData)

  // Sync to database
  try {
    await prisma.user.update({
      where: { telegramId: BigInt(user.id) },
      data: { phone },
    })
  } catch (e) {
    // Ignore
  }

  const text = `✅ Telefon raqamingiz qabul qilindi: <b>${phone}</b>\n\nEndi esa taomlarni qayerga yetkazib berishimiz kerak?\nIltimos, pastdagi tugma orqali joylashuvingizni (geolokatsiyani) yuboring yoki manzilni yozma xabar qilib yuboring:`

  await ctx.reply(text, {
    parse_mode: 'HTML',
    reply_markup: getLocationKeyboard(),
  })
})

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 2500)
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: { 'User-Agent': 'TTNamanganBot/1.0' },
        signal: controller.signal,
      }
    )
    clearTimeout(timer)
    if (res.ok) {
      const data = (await res.json()) as any
      const addr = data.address
      if (addr) {
        const parts: string[] = []
        if (addr.road) parts.push(addr.road)
        if (addr.house_number) parts.push(`${addr.house_number}-uy`)
        if (addr.suburb || addr.neighbourhood) parts.push(addr.suburb || addr.neighbourhood)
        if (addr.city || addr.town || addr.county) parts.push(addr.city || addr.town || addr.county)
        if (parts.length > 0) {
          return parts.join(', ')
        }
      }
      if (data.display_name) {
        return data.display_name.split(',').slice(0, 3).join(',').trim()
      }
    }
  } catch (err) {
    // Fallback to coordinates
  }
  return `Namangan sh., Joylashuv (${lat.toFixed(4)}, ${lng.toFixed(4)})`
}

// 3. Handle Location
bot.on('message:location', async ctx => {
  const loc = ctx.message.location
  const user = ctx.from
  if (!loc || !user) return

  let userData = userStore[String(user.id)] || {
    telegramId: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    username: user.username,
  }

  userData.lat = loc.latitude
  userData.lng = loc.longitude

  // Reverse geocode location to get human-readable street / district
  const readableAddress = await reverseGeocode(loc.latitude, loc.longitude)
  userData.address = readableAddress
  userData.step = 'registered'
  saveBotUser(userData)

  const successText = `🎉 <b>Yetkazib berish manzilingiz belgilandi!</b>\n\n📍 Manzil: <b>${userData.address}</b>\n📱 Telefon: <b>${userData.phone || "Qayd etilgan"}</b>\n\nMenyuni ochish va buyurtma berish uchun quyidagi <b>🍽 Buyurtma berish</b> tugmasini bosing:`

  await ctx.reply(successText, {
    parse_mode: 'HTML',
    reply_markup: getMainMenuKeyboard(userData),
  })

  const appUrl = buildWebAppUrl(userData)
  if (appUrl.startsWith('https://')) {
    try {
      await ctx.api.setChatMenuButton({
        chat_id: user.id,
        menu_button: {
          type: 'web_app',
          text: '🍽 Buyurtma berish',
          web_app: { url: appUrl },
        },
      })
    } catch (e) {
      // Ignore
    }
  }
})

// 4. Handle "Keyinroq kiritish"
bot.hears('➡️ Keyinroq kiritish', async ctx => {
  const user = ctx.from
  if (!user) return

  let userData = userStore[String(user.id)] || {
    telegramId: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    username: user.username,
  }

  if (!userData.address) {
    userData.address = 'Namangan shahri'
  }
  userData.step = 'registered'
  saveBotUser(userData)

  const text = `Tushunarli! Manzilingiz <b>${userData.address}</b> qilib belgilandi. Istalgan vaqtda manzilni yozma xabar yuborib yangilashingiz mumkin.\n\nMenyuni ko'rish uchun quyidagi tugmani bosing:`

  await ctx.reply(text, {
    parse_mode: 'HTML',
    reply_markup: getMainMenuKeyboard(userData),
  })
})

// Handle "Bekor qilish"
bot.hears('⬅️ Bekor qilish', async ctx => {
  const user = ctx.from
  if (!user) return

  let userData = userStore[String(user.id)] || {
    telegramId: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    username: user.username,
  }
  userData.step = 'registered'
  saveBotUser(userData)

  await ctx.reply('Bosh menyu:', {
    reply_markup: getMainMenuKeyboard(userData),
  })
})

// 5. Handle "Manzilni yangilash"
bot.hears('📍 Manzilni yangilash', async ctx => {
  const user = ctx.from
  if (!user) return

  let userData = userStore[String(user.id)] || {
    telegramId: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    username: user.username,
  }
  userData.step = 'awaiting_location'
  saveBotUser(userData)

  const currentAddr = userData.address ? `\n\n<i>Hozirgi manzilingiz:</i> <b>${userData.address}</b>` : ''

  await ctx.reply(
    `📍 <b>Yetkazib berish manzilini yangilash</b>${currentAddr}\n\nQuyidagi usullardan birini tanlang:\n1️⃣ Pastdagi <b>📍 Joylashuvni yuborish</b> tugmasini bosing (geolokatsiya)\n2️⃣ Yoki yangi manzilingizni (ko'cha, uy raqami yoki mo'ljal) <b>yozma xabar</b> qilib yuboring (masalan: <i>Boburshoh ko'chasi 24-uy</i>):`,
    {
      parse_mode: 'HTML',
      reply_markup: getLocationKeyboard(),
    }
  )
})

// 6. Handle "Raqamni yangilash"
bot.hears('📱 Raqamni yangilash', async ctx => {
  const user = ctx.from
  if (!user) return

  let userData = userStore[String(user.id)] || {
    telegramId: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    username: user.username,
  }
  userData.step = 'awaiting_phone'
  saveBotUser(userData)

  const currentPhone = userData.phone ? `\n\n<i>Hozirgi raqam:</i> <b>${userData.phone}</b>` : ''

  await ctx.reply(
    `📱 <b>Telefon raqamini yangilash</b>${currentPhone}\n\nQuyidagi tugma orqali yangi telefon raqamingizni yuboring yoki raqamni yozma ravishda yuboring:`,
    {
      parse_mode: 'HTML',
      reply_markup: getPhoneKeyboard(),
    }
  )
})

// Handle "Buyurtma berish" button pressed as regular text
bot.hears('🍽 Buyurtma berish', async ctx => {
  const user = ctx.from
  if (!user) return

  let userData = userStore[String(user.id)] || {
    telegramId: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    username: user.username,
  }
  const webAppUrl = buildWebAppUrl(userData)
  const isHttps = webAppUrl.startsWith('https://')
  const kb = new InlineKeyboard()
  if (isHttps) {
    kb.webApp('🍽 Menyuni ochish', webAppUrl)
  } else {
    kb.url('🍽 Menyuni ochish', webAppUrl)
  }
  await ctx.reply(
    `🍽 <b>TT Namangan — Taomlar Menyusi</b>\n\n📱 Telefon: <b>${userData.phone || 'Kiritilmagan'}</b>\n📍 Manzil: <b>${userData.address || 'Namangan shahri'}</b>\n\nIlovani ochish uchun quyidagi tugmani bosing:`,
    {
      parse_mode: 'HTML',
      reply_markup: kb,
    }
  )
})

// 7. Handle text messages (address typing & typed phone numbers)
bot.on('message:text', async (ctx, next) => {
  const text = ctx.message.text.trim()
  const user = ctx.from
  if (!user) return next()

  // Skip commands and known menu buttons
  const knownButtons = [
    '📦 Buyurtmalarim',
    '📍 Manzilni yangilash',
    '📱 Raqamni yangilash',
    '☎️ Yordam',
    '➡️ Keyinroq kiritish',
    '⬅️ Bekor qilish',
    '🍽 Buyurtma berish',
    '📍 Joylashuvni yuborish',
    '📱 Telefon raqamni yuborish',
  ]
  if (text.startsWith('/') || knownButtons.includes(text)) {
    return next()
  }

  let userData = userStore[String(user.id)] || {
    telegramId: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    username: user.username,
  }

  // Check if text looks like a phone number (e.g. +998901234567, 901234567, etc.)
  const cleanPhone = text.replace(/[\s\-()]/g, '')
  const isPhoneNumber = /^(\+?998)?[0-9]{9}$/.test(cleanPhone) || /^[0-9]{9,13}$/.test(cleanPhone)

  if (isPhoneNumber && (!userData.phone || userData.step === 'awaiting_phone')) {
    let formatted = cleanPhone
    if (!formatted.startsWith('+')) {
      if (formatted.startsWith('998')) formatted = '+' + formatted
      else formatted = '+998' + formatted
    }
    userData.phone = formatted
    userData.step = 'awaiting_location'
    saveBotUser(userData)

    try {
      await prisma.user.update({
        where: { telegramId: BigInt(user.id) },
        data: { phone: formatted },
      })
    } catch {}

    const promptLocation = `✅ Telefon raqamingiz saqlandi: <b>${formatted}</b>\n\nEndi esa taomlarni qayerga yetkazib berishimiz kerak?\n\nIltimos, pastdagi tugma orqali joylashuvingizni (geolokatsiyani) yuboring yoki manzilni yozma xabar qilib yuboring:`

    await ctx.reply(promptLocation, {
      parse_mode: 'HTML',
      reply_markup: getLocationKeyboard(),
    })
    return
  }

  // Otherwise, ANY text is treated as an address update!
  userData.address = text
  userData.step = 'registered'
  saveBotUser(userData)

  try {
    await prisma.user.update({
      where: { telegramId: BigInt(user.id) },
      data: { phone: userData.phone || null },
    })
  } catch {}

  const successMsg = `✅ <b>Yetkazib berish manzilingiz muvaffaqiyatli saqlandi!</b>\n\n📍 Manzil: <b>${text}</b>\n📱 Telefon: <b>${userData.phone || 'Qayd etilgan'}</b>\n\nMenyuni ko'rish va buyurtma berish uchun pastdagi <b>🍽 Buyurtma berish</b> tugmasini bosing:`

  await ctx.reply(successMsg, {
    parse_mode: 'HTML',
    reply_markup: getMainMenuKeyboard(userData),
  })

  const appUrl = buildWebAppUrl(userData)
  if (appUrl.startsWith('https://')) {
    try {
      await ctx.api.setChatMenuButton({
        chat_id: user.id,
        menu_button: {
          type: 'web_app',
          text: '🍽 Buyurtma berish',
          web_app: { url: appUrl },
        },
      })
    } catch (e) {}
  }
})

// 8. Buyurtmalarim
bot.hears('📦 Buyurtmalarim', async ctx => {
  const user = ctx.from
  if (!user) return

  const userData = userStore[String(user.id)] || {
    telegramId: user.id,
    firstName: user.first_name,
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { telegramId: BigInt(user.id) },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: { items: true },
        },
      },
    })

    if (!dbUser || dbUser.orders.length === 0) {
      await ctx.reply(
        "Sizda hali buyurtmalar mavjud emas.\n\nMenyudan sara taomlarni tanlab buyurtma berish uchun pastdagi <b>🍽 Menyuni ochish (Mini App)</b> tugmasini bosing!",
        {
          parse_mode: 'HTML',
          reply_markup: getPhysicalKeyboard(userData),
        }
      )
      return
    }

    let msg = '<b>Sizning buyurtmalaringiz:</b>\n\n'
    for (const ord of dbUser.orders) {
      msg += `📦 <b>#${ord.orderNumber}</b> — ${ord.total.toLocaleString('uz-UZ')} so'm\n`
      msg += `Holat: <i>${ord.status}</i> | Sana: ${new Date(ord.createdAt).toLocaleDateString('uz-UZ')}\n\n`
    }

    await ctx.reply(msg, {
      parse_mode: 'HTML',
      reply_markup: getPhysicalKeyboard(userData),
    })
  } catch (e) {
    await ctx.reply(
      "Buyurtmalar tarixini ko'rish uchun pastdagi <b>🍽 Menyuni ochish (Mini App)</b> tugmasini bosing!",
      {
        parse_mode: 'HTML',
        reply_markup: getPhysicalKeyboard(userData),
      }
    )
  }
})

// 9. Bog'lanish va Yordam
bot.hears(['☎️ Bog\'lanish', '☎️ Yordam'], async ctx => {
  const text = `☎️ <b>«TEZKOR TAOM NAMANGAN» — Bog'lanish</b>\n\n• 📞 Buyurtma uchun tel: <b>(33) 675-55-50</b>\n• ✈️ Rasmiy Telegram: <b>@tezkorburger</b>\n• ⚡️ Yetkazib berish: <b>10 000 so'm</b> (Namangan shahri)\n• ⏰ Ish vaqti: <b>Har kuni 09:00 dan 23:00 gacha</b>\n\nIlovani ochish uchun pastdagi <b>🍽 Menyuni ochish</b> tugmasini bosing!`
  await ctx.reply(text, { parse_mode: 'HTML' })
})

// 10. Operational Group Callbacks (for staff and couriers)
bot.on('callback_query:data', async ctx => {
  const data = ctx.callbackQuery.data
  const staffName = ctx.from?.first_name || 'Staff'

  // A. Status change: order_status:<orderId>:<newStatus>
  if (data.startsWith('order_status:')) {
    const [, orderId, newStatus] = data.split(':')
    try {
      const updatedOrder = await OrderService.updateOrderStatus(
        orderId,
        newStatus as OrderStatus,
        staffName
      )

      await ctx.answerCallbackQuery({ text: `Holat yangilandi: ${newStatus}` })

      // Update group message
      await TelegramNotifier.updateGroupOrderMessage(updatedOrder)

      // Notify customer in private chat
      await TelegramNotifier.notifyCustomer(
        updatedOrder.user.telegramId,
        updatedOrder.orderNumber,
        updatedOrder.status
      )
    } catch (err: any) {
      console.error('Callback error:', err)
      await ctx.answerCallbackQuery({ text: `Xatolik: ${err.message}`, show_alert: true })
    }
  }

  // B. Courier Menu: order_courier_menu:<orderId>
  else if (data.startsWith('order_courier_menu:')) {
    const [, orderId] = data.split(':')
    try {
      const couriers = await prisma.courier.findMany({ where: { isActive: true } })
      if (couriers.length === 0) {
        await ctx.answerCallbackQuery({
          text: 'Faol kuryerlar topilmadi.',
          show_alert: true,
        })
        return
      }

      const kb = new InlineKeyboard()
      for (const c of couriers) {
        kb.text(`🚴 ${c.name}`, `order_assign:${orderId}:${c.id}`).row()
      }
      kb.text('⬅️ Orqaga', `order_status:${orderId}:ACCEPTED`)

      await ctx.editMessageReplyMarkup({ reply_markup: kb })
      await ctx.answerCallbackQuery()
    } catch (err: any) {
      await ctx.answerCallbackQuery({ text: err.message, show_alert: true })
    }
  }

  // C. Courier Assign: order_assign:<orderId>:<courierId>
  else if (data.startsWith('order_assign:')) {
    const [, orderId, courierId] = data.split(':')
    try {
      const updatedOrder = await OrderService.assignCourier(orderId, courierId, staffName)
      await ctx.answerCallbackQuery({ text: `Kuryer biriktirildi: ${updatedOrder.courier?.name}` })

      // Update group message
      await TelegramNotifier.updateGroupOrderMessage(updatedOrder)

      // Notify customer
      await TelegramNotifier.notifyCustomer(
        updatedOrder.user.telegramId,
        updatedOrder.orderNumber,
        'COURIER_ASSIGNED'
      )
    } catch (err: any) {
      await ctx.answerCallbackQuery({ text: err.message, show_alert: true })
    }
  }
})

// 11. Channel and Group Membership & Post Listener
bot.on('my_chat_member', ctx => {
  const chat = ctx.myChatMember.chat
  console.log(`🤖 Bot added to chat/channel: [${(chat as any).title || ''}] id=${chat.id} type=${chat.type}`)
  setResolvedChatId(String(chat.id))
})

bot.on('channel_post', ctx => {
  const chat = ctx.channelPost.chat
  console.log(`📢 Channel post in: [${(chat as any).title || ''}] id=${chat.id}`)
  setResolvedChatId(String(chat.id))
})
