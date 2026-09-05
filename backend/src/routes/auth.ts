import { Router } from 'express'
import { prisma } from '../database'
import { config } from '../config'
import { validateTelegramInitData, generateToken, requireAuth } from '../middleware/auth'

export const authRouter = Router()

/**
 * POST /api/auth/telegram
 * Authenticates Telegram WebApp user using initData signature verification.
 */
authRouter.post('/telegram', async (req, res): Promise<void> => {
  try {
    const { initData } = req.body

    if (!initData) {
      res.status(400).json({ error: 'initData string talab qilinadi' })
      return
    }

    let telegramUser: any = null

    // If bot token is configured, perform strict HMAC-SHA256 verification
    if (config.botToken && config.botToken !== '123456:dummy_token_for_local_development') {
      const validation = validateTelegramInitData(initData, config.botToken)
      if (!validation.valid || !validation.user) {
        res.status(401).json({ error: 'Telegram autentifikatsiya maʼlumotlari yaroqsiz' })
        return
      }
      telegramUser = validation.user
    } else {
      // Development mode fallback: parse user from initData query string safely
      try {
        const params = new URLSearchParams(initData)
        const userJson = params.get('user')
        if (userJson) {
          telegramUser = JSON.parse(userJson)
        }
      } catch (e) {
        // Continue
      }
    }

    if (!telegramUser || !telegramUser.id) {
      res.status(400).json({ error: 'Foydalanuvchi maʼlumoti aniqlanmadi' })
      return
    }

    // Upsert user in PostgreSQL
    const user = await prisma.user.upsert({
      where: { telegramId: BigInt(telegramUser.id) },
      update: {
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name || null,
        username: telegramUser.username || null,
      },
      create: {
        telegramId: BigInt(telegramUser.id),
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name || null,
        username: telegramUser.username || null,
        role: 'CUSTOMER',
      },
    })

    const token = generateToken({
      id: user.id,
      telegramId: user.telegramId.toString(),
      firstName: user.firstName,
      lastName: user.lastName || undefined,
      username: user.username || undefined,
      role: user.role,
    })

    res.json({
      token,
      user: {
        id: user.id,
        telegramId: user.telegramId.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        phone: user.phone,
        role: user.role,
      },
    })
  } catch (error: any) {
    console.error('Auth error:', error)
    res.status(500).json({ error: 'Autentifikatsiya jarayonida xatolik yuz berdi' })
  }
})

/**
 * GET /api/me
 * Retrieves current authenticated user profile and stats.
 */
authRouter.get('/me', requireAuth, async (req, res): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        orders: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { items: true },
        },
        favorites: true,
      },
    })

    if (!user) {
      res.status(404).json({ error: 'Foydalanuvchi topilmadi' })
      return
    }

    res.json({
      id: user.id,
      telegramId: user.telegramId.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      phone: user.phone,
      role: user.role,
      orderCount: user.orders.length,
      favoriteCount: user.favorites.length,
      recentOrders: user.orders,
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})
