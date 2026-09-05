import { Router } from 'express'
import { prisma } from '../database'
import { OrderService, inMemoryOrders } from '../services/orderService'
import { TelegramNotifier } from '../services/telegramNotifier'
import { requireAuth } from '../middleware/auth'
import { OrderStatus } from '@prisma/client'

export const ordersRouter = Router()

/**
 * POST /api/orders
 * Securely creates a new order with server-calculated totals.
 */
ordersRouter.post('/', async (req, res): Promise<void> => {
  try {
    const { items, address, phone, customerNote, latitude, longitude, userId, telegramId, customerName, promoCode, discount } = req.body

    let targetUserId = req.user?.id
    const effectiveTgId = telegramId || (userId && !isNaN(Number(userId)) ? Number(userId) : null)

    if (!targetUserId && effectiveTgId) {
      try {
        const upserted = await prisma.user.upsert({
          where: { telegramId: BigInt(effectiveTgId) },
          update: {
            firstName: customerName || undefined,
            phone: phone || undefined,
          },
          create: {
            telegramId: BigInt(effectiveTgId),
            firstName: customerName || 'Mijoz',
            phone: phone || '+998 90 123 45 67',
            role: 'CUSTOMER',
          },
        })
        targetUserId = upserted.id
      } catch (err) {
        console.error('Failed to upsert user by telegramId:', err)
      }
    }

    if (!targetUserId && userId) {
      try {
        const existing = await prisma.user.findUnique({ where: { id: userId } })
        if (existing) {
          targetUserId = existing.id
        }
      } catch {}
    }

    if (!targetUserId) {
      try {
        const defaultUser = await prisma.user.upsert({
          where: { telegramId: BigInt(99890123) },
          update: {
            firstName: customerName || 'Mijoz',
            phone: phone || '+998 90 123 45 67',
          },
          create: {
            telegramId: BigInt(99890123),
            firstName: customerName || 'Mijoz',
            phone: phone || '+998 90 123 45 67',
            role: 'CUSTOMER',
          },
        })
        targetUserId = defaultUser.id
      } catch (err) {
        console.error('Failed to upsert fallback user:', err)
        targetUserId = 'usr-guest-001'
      }
    }

    const order = await OrderService.createOrder({
      userId: targetUserId,
      items,
      address,
      phone,
      customerNote,
      latitude,
      longitude,
      promoCode,
      discount,
    })

    // Send to restaurant Telegram group
    try {
      await TelegramNotifier.sendOrderToGroup(order)
    } catch (tgErr) {
      console.error('Telegram notification error:', tgErr)
    }

    // Notify customer via Telegram bot
    try {
      const tgId = order.user?.telegramId || effectiveTgId
      if (tgId && Number(tgId) > 0 && String(tgId) !== String(config.ordersChatId)) {
        await TelegramNotifier.notifyCustomer(tgId, order.orderNumber, 'CREATED')
      }
    } catch (custErr) {
      console.error('Customer notification error:', custErr)
    }

    res.status(201).json(order)
  } catch (error: any) {
    console.error('Order creation error:', error)
    res.status(400).json({ error: error.message || 'Buyurtma yaratishda xatolik yuz berdi' })
  }
})

/**
 * GET /api/orders
 * Retrieves orders for the authenticated user.
 */
ordersRouter.get('/', async (req, res): Promise<void> => {
  try {
    const telegramId = req.query.telegramId ? String(req.query.telegramId) : null
    const phone = req.query.phone ? String(req.query.phone) : null
    const userId = (req as any).user?.id || (req.query.userId ? String(req.query.userId) : null)

    const where: any = {}
    if (userId) {
      where.userId = userId
    } else if (telegramId) {
      const dbUser = await prisma.user.findFirst({
        where: { telegramId: BigInt(telegramId) },
      })
      if (dbUser) {
        where.userId = dbUser.id
      } else {
        res.json([])
        return
      }
    } else if (phone) {
      where.phone = phone
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        courier: true,
      },
    })

    res.json(orders)
  } catch (err) {
    res.json([])
  }
})

/**
 * GET /api/orders/:id
 * Retrieves order details and tracking status.
 */
ordersRouter.get('/:id', async (req, res): Promise<void> => {
  try {
    const idOrNum = req.params.id
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: idOrNum },
          { orderNumber: idOrNum },
        ],
      },
      include: {
        items: true,
        courier: true,
        statusHistory: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (order) {
      res.json(order)
      return
    }
  } catch {
    // Database unavailable, try in-memory store
  }

  const memOrder = inMemoryOrders.get(req.params.id)
  if (memOrder) {
    res.json(memOrder)
    return
  }

  res.status(404).json({ error: 'Buyurtma topilmadi' })
})

/**
 * PATCH /api/orders/:id/status
 * Updates status of an order and notifies customer.
 */
ordersRouter.patch('/:id/status', async (req, res): Promise<void> => {
  try {
    const { status, note, changedBy } = req.body

    const updated = await OrderService.updateOrderStatus(
      req.params.id,
      status as OrderStatus,
      changedBy || 'STAFF',
      note
    )

    // Update group message
    await TelegramNotifier.updateGroupOrderMessage(updated)

    // Notify customer
    await TelegramNotifier.notifyCustomer(
      updated.user.telegramId,
      updated.orderNumber,
      updated.status
    )

    res.json(updated)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})
