import { Router } from 'express'
import { prisma } from '../database'
import { config } from '../config'
import { generateToken, requireAdmin } from '../middleware/auth'
import { OrderService } from '../services/orderService'
import { TelegramNotifier } from '../services/telegramNotifier'
import { OrderStatus } from '@prisma/client'

export const adminRouter = Router()

/**
 * POST /api/admin/auth/login
 * Dedicated administrative login (isolated from customer authentication).
 */
adminRouter.post('/auth/login', async (req, res): Promise<void> => {
  try {
    const { username, password } = req.body

    // Default admin credentials (can be customized via environment)
    const adminUser = process.env.ADMIN_USERNAME || 'admin'
    const adminPass = process.env.ADMIN_PASSWORD || 'admin123'

    if (username !== adminUser || password !== adminPass) {
      res.status(401).json({ error: 'Login yoki parol notoʻgʻri' })
      return
    }

    let adminId = 'usr-admin-001'
    let adminName = 'Administrator'
    let adminUsername = 'admin'

    try {
      // Upsert admin record in PostgreSQL
      const dbAdmin = await prisma.user.upsert({
        where: { telegramId: BigInt(1) },
        update: { role: 'ADMIN', username: 'admin' },
        create: {
          telegramId: BigInt(1),
          firstName: 'Administrator',
          username: 'admin',
          role: 'ADMIN',
        },
      })
      adminId = dbAdmin.id
      adminName = dbAdmin.firstName
      adminUsername = dbAdmin.username || 'admin'
    } catch {
      // Postgres offline, proceed with valid admin token
    }

    const token = generateToken({
      id: adminId,
      telegramId: '1',
      firstName: adminName,
      username: adminUsername,
      role: 'ADMIN',
    })

    res.json({
      token,
      admin: {
        id: adminId,
        name: adminName,
        username: adminUsername,
        role: 'ADMIN',
      },
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// All subsequent admin routes require valid ADMIN JWT token
adminRouter.use(requireAdmin)

/**
 * GET /api/admin/stats
 * Dashboard overview statistics.
 */
adminRouter.get('/stats', async (req, res): Promise<void> => {
  try {
    const totalOrders = await prisma.order.count()
    const pendingOrders = await prisma.order.count({ where: { status: 'PENDING' } })
    const preparingOrders = await prisma.order.count({ where: { status: 'PREPARING' } })
    const deliveringOrders = await prisma.order.count({ where: { status: 'DELIVERING' } })
    const deliveredOrders = await prisma.order.count({ where: { status: 'DELIVERED' } })

    const totalRevenueAgg = await prisma.order.aggregate({
      _sum: { total: true },
      where: { status: 'DELIVERED' },
    })

    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    const todayRevenueAgg = await prisma.order.aggregate({
      _sum: { total: true },
      where: {
        status: 'DELIVERED',
        createdAt: { gte: startOfToday },
      },
    })

    const totalProducts = await prisma.product.count()
    const totalCustomers = await prisma.user.count({ where: { role: 'CUSTOMER' } })
    const activeCouriers = await prisma.courier.count({ where: { isActive: true } })

    res.json({
      totalRevenue: totalRevenueAgg._sum.total || 0,
      todayRevenue: todayRevenueAgg._sum.total || 0,
      totalOrders,
      pendingOrders,
      preparingOrders,
      deliveringOrders,
      deliveredOrders,
      totalProducts,
      totalCustomers,
      activeCouriers,
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * GET /api/admin/orders
 * List orders with status and search filters.
 */
adminRouter.get('/orders', async (req, res): Promise<void> => {
  try {
    const { status, search } = req.query

    const where: any = {}
    if (status && status !== 'ALL') {
      where.status = status
    }
    if (search) {
      const q = String(search)
      where.OR = [
        { orderNumber: { contains: q, mode: 'insensitive' } },
        { phone: { contains: q } },
        { address: { contains: q, mode: 'insensitive' } },
      ]
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        courier: true,
        items: true,
      },
    })

    res.json(orders)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * GET /api/admin/orders/:id
 */
adminRouter.get('/orders/:id', async (req, res): Promise<void> => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        user: true,
        courier: true,
        items: {
          include: { product: true },
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!order) {
      res.status(404).json({ error: 'Buyurtma topilmadi' })
      return
    }

    res.json(order)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * PATCH /api/admin/orders/:id/status
 */
adminRouter.patch('/orders/:id/status', async (req, res): Promise<void> => {
  try {
    const { status, note } = req.body
    const adminName = req.user?.firstName || 'Admin'

    const updated = await OrderService.updateOrderStatus(
      req.params.id,
      status as OrderStatus,
      adminName,
      note
    )

    await TelegramNotifier.updateGroupOrderMessage(updated)
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

/**
 * POST /api/admin/orders/:id/assign-courier
 */
adminRouter.post('/orders/:id/assign-courier', async (req, res): Promise<void> => {
  try {
    const { courierId } = req.body
    const adminName = req.user?.firstName || 'Admin'

    const updated = await OrderService.assignCourier(req.params.id, courierId, adminName)

    await TelegramNotifier.updateGroupOrderMessage(updated)
    await TelegramNotifier.notifyCustomer(
      updated.user.telegramId,
      updated.orderNumber,
      'COURIER_ASSIGNED'
    )

    res.json(updated)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

/**
 * Products CRUD
 */
adminRouter.get('/products', async (req, res): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        category: true,
        options: true,
      },
    })
    res.json(products)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

adminRouter.post('/products', async (req, res): Promise<void> => {
  try {
    const {
      categoryId,
      name,
      description,
      ingredients,
      image,
      price,
      oldPrice,
      discount,
      inStock,
      preparationTime,
      options,
    } = req.body

    const product = await prisma.product.create({
      data: {
        categoryId,
        name,
        description,
        ingredients: ingredients || [],
        image: image || 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=400&h=300&fit=crop',
        price: Number(price),
        oldPrice: oldPrice ? Number(oldPrice) : null,
        discount: discount ? Number(discount) : null,
        inStock: inStock !== undefined ? Boolean(inStock) : true,
        preparationTime: preparationTime ? Number(preparationTime) : null,
        options: options && options.length > 0 ? { create: options } : undefined,
      },
      include: { category: true, options: true },
    })

    res.status(201).json(product)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

adminRouter.put('/products/:id', async (req, res): Promise<void> => {
  try {
    const {
      categoryId,
      name,
      description,
      ingredients,
      image,
      price,
      oldPrice,
      discount,
      inStock,
      preparationTime,
    } = req.body

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        categoryId,
        name,
        description,
        ingredients: ingredients !== undefined ? ingredients : undefined,
        image,
        price: price !== undefined ? Number(price) : undefined,
        oldPrice: oldPrice !== undefined ? (oldPrice ? Number(oldPrice) : null) : undefined,
        discount: discount !== undefined ? (discount ? Number(discount) : null) : undefined,
        inStock: inStock !== undefined ? Boolean(inStock) : undefined,
        preparationTime: preparationTime !== undefined ? Number(preparationTime) : undefined,
      },
      include: { category: true, options: true },
    })

    res.json(product)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

adminRouter.delete('/products/:id', async (req, res): Promise<void> => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } })
    res.json({ success: true, message: "Mahsulot o'chirildi" })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

/**
 * Categories CRUD
 */
adminRouter.get('/categories', async (req, res): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { products: true } },
      },
    })
    res.json(categories)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

adminRouter.post('/categories', async (req, res): Promise<void> => {
  try {
    const { slug, name, emoji, image, description, sortOrder } = req.body
    const category = await prisma.category.create({
      data: {
        slug,
        name,
        emoji,
        image,
        description,
        sortOrder: sortOrder ? Number(sortOrder) : 0,
      },
    })
    res.status(201).json(category)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

adminRouter.put('/categories/:id', async (req, res): Promise<void> => {
  try {
    const { slug, name, emoji, image, description, sortOrder, isActive } = req.body
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: {
        slug,
        name,
        emoji,
        image,
        description,
        sortOrder: sortOrder !== undefined ? Number(sortOrder) : undefined,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
      },
    })
    res.json(category)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

adminRouter.delete('/categories/:id', async (req, res): Promise<void> => {
  try {
    await prisma.category.delete({ where: { id: req.params.id } })
    res.json({ success: true, message: "Kategoriya o'chirildi" })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

/**
 * Couriers CRUD
 */
adminRouter.get('/couriers', async (req, res): Promise<void> => {
  try {
    const couriers = await prisma.courier.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            orders: {
              where: { status: { in: ['COURIER_ASSIGNED', 'PICKED_UP', 'DELIVERING'] } },
            },
          },
        },
      },
    })
    res.json(couriers)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

adminRouter.post('/couriers', async (req, res): Promise<void> => {
  try {
    const { name, phone, telegramId } = req.body
    const courier = await prisma.courier.create({
      data: {
        name,
        phone,
        telegramId: telegramId ? BigInt(telegramId) : null,
        isActive: true,
      },
    })
    res.status(201).json({
      ...courier,
      telegramId: courier.telegramId ? courier.telegramId.toString() : null,
    })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

adminRouter.put('/couriers/:id', async (req, res): Promise<void> => {
  try {
    const { name, phone, isActive, telegramId } = req.body
    const courier = await prisma.courier.update({
      where: { id: req.params.id },
      data: {
        name,
        phone,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
        telegramId: telegramId ? BigInt(telegramId) : undefined,
      },
    })
    res.json({
      ...courier,
      telegramId: courier.telegramId ? courier.telegramId.toString() : null,
    })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

/**
 * Customers List
 */
adminRouter.get('/customers', async (req, res): Promise<void> => {
  try {
    const customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { orders: true } },
      },
    })

    const formatted = customers.map(c => ({
      id: c.id,
      telegramId: c.telegramId.toString(),
      firstName: c.firstName,
      lastName: c.lastName,
      username: c.username,
      phone: c.phone,
      orderCount: c._count.orders,
      createdAt: c.createdAt,
    }))

    res.json(formatted)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})
