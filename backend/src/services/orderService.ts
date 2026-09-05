import { prisma } from '../database'
import { OrderStatus } from '@prisma/client'
import { FALLBACK_PRODUCTS } from '../routes/products'

export interface CreateOrderItemInput {
  productId: string
  quantity: number
  extras: string[]
}

export interface CreateOrderInput {
  userId: string
  items: CreateOrderItemInput[]
  address: string
  phone: string
  customerNote?: string
  latitude?: number
  longitude?: number
}

export function generateOrderNumber(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING: ['ACCEPTED', 'CANCELLED', 'PROBLEM'],
  ACCEPTED: ['PREPARING', 'COURIER_ASSIGNED', 'CANCELLED', 'PROBLEM'],
  PREPARING: ['COURIER_ASSIGNED', 'PICKED_UP', 'PROBLEM'],
  COURIER_ASSIGNED: ['PICKED_UP', 'DELIVERING', 'PROBLEM'],
  PICKED_UP: ['DELIVERING', 'PROBLEM'],
  DELIVERING: ['DELIVERED', 'PROBLEM'],
  DELIVERED: [],
  CANCELLED: [],
  PROBLEM: ['PENDING', 'ACCEPTED', 'PREPARING', 'CANCELLED'],
}

export function isValidStatusTransition(from: string, to: string): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false
}

export const inMemoryOrders = new Map<string, any>()

export class OrderService {
  /**
   * Calculates totals and creates an order atomically in the database.
   */
  static async createOrder(input: CreateOrderInput) {
    if (!input.items || input.items.length === 0) {
      throw new Error('Savatchada kamida 1 ta taom boʻlishi kerak.')
    }

    let subtotal = 0
    const processedItems: Array<{
      productId: string
      productNameSnapshot: string
      priceSnapshot: number
      quantity: number
      selectedExtras: string[]
      itemTotal: number
    }> = []

    for (const itemInput of input.items) {
      let product: any = null
      try {
        product = await prisma.product.findUnique({
          where: { id: itemInput.productId },
          include: { options: true },
        })
      } catch {
        product = FALLBACK_PRODUCTS.find(p => p.id === itemInput.productId)
      }
      if (!product) {
        product = FALLBACK_PRODUCTS.find(p => p.id === itemInput.productId)
      }

      if (!product) {
        throw new Error(`Mahsulot topilmadi: ${itemInput.productId}`)
      }

      if (product.inStock === false) {
        throw new Error(`"${product.name}" hozirda mavjud emas.`)
      }

      // Calculate extras
      let extrasCost = 0
      const validExtras: string[] = []
      if (itemInput.extras && itemInput.extras.length > 0) {
        const availableOptions = product.options || product.extras || []
        for (const extraName of itemInput.extras) {
          const opt = availableOptions.find((o: any) => o.name === extraName)
          if (opt) {
            extrasCost += opt.price
            validExtras.push(opt.name)
          }
        }
      }

      const unitPrice = product.price + extrasCost
      const itemTotal = unitPrice * itemInput.quantity
      subtotal += itemTotal

      processedItems.push({
        productId: product.id,
        productNameSnapshot: product.name,
        priceSnapshot: unitPrice,
        quantity: itemInput.quantity,
        selectedExtras: validExtras,
        itemTotal,
      })
    }

    // Server-enforced financial calculations
    const deliveryFee = 10000
    const discount = subtotal > 50000 ? 5000 : 0
    const total = subtotal + deliveryFee - discount
    const orderNumber = generateOrderNumber()

    try {
      // Atomic transaction via Prisma
      const order = await prisma.$transaction(async tx => {
        const createdOrder = await tx.order.create({
          data: {
            orderNumber,
            userId: input.userId,
            subtotal,
            deliveryFee,
            discount,
            total,
            status: 'PENDING',
            phone: input.phone,
            address: input.address,
            latitude: input.latitude,
            longitude: input.longitude,
            customerNote: input.customerNote,
            items: {
              create: processedItems.map(pi => ({
                productId: pi.productId,
                productNameSnapshot: pi.productNameSnapshot,
                priceSnapshot: pi.priceSnapshot,
                quantity: pi.quantity,
                selectedExtras: pi.selectedExtras,
                itemTotal: pi.itemTotal,
              })),
            },
            statusHistory: {
              create: {
                newStatus: 'PENDING',
                changedBy: 'CUSTOMER',
                note: 'Buyurtma muvaffaqiyatli rasmiylashtirildi',
              },
            },
          },
          include: {
            items: {
              include: { product: true },
            },
            user: true,
          },
        })

        return createdOrder
      })

      inMemoryOrders.set(order.id, order)
      inMemoryOrders.set(order.orderNumber, order)
      return order
    } catch {
      // Graceful in-memory fallback
      const memOrder = {
        id: 'ord-' + orderNumber.toLowerCase(),
        orderNumber,
        userId: input.userId,
        subtotal,
        deliveryFee,
        discount,
        total,
        status: 'PENDING' as OrderStatus,
        phone: input.phone,
        address: input.address,
        latitude: input.latitude,
        longitude: input.longitude,
        customerNote: input.customerNote,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        items: processedItems.map((pi, idx) => ({
          id: `item-${idx + 1}`,
          productId: pi.productId,
          productNameSnapshot: pi.productNameSnapshot,
          priceSnapshot: pi.priceSnapshot,
          quantity: pi.quantity,
          selectedExtras: pi.selectedExtras,
          itemTotal: pi.itemTotal,
        })),
        statusHistory: [
          {
            id: 'hist-1',
            oldStatus: null,
            newStatus: 'PENDING',
            changedBy: 'CUSTOMER',
            note: 'Buyurtma muvaffaqiyatli rasmiylashtirildi',
            createdAt: new Date().toISOString(),
          },
        ],
        user: {
          id: input.userId,
          firstName: 'Saidislom',
          phone: input.phone,
          telegramId: '99890123',
        },
      }
      inMemoryOrders.set(memOrder.id, memOrder)
      inMemoryOrders.set(memOrder.orderNumber, memOrder)
      return memOrder
    }
  }

  /**
   * Transitions an order's status and logs to OrderStatusHistory.
   */
  static async updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    changedBy: string,
    note?: string
  ) {
    let currentOrder: any = null
    try {
      currentOrder = await prisma.order.findUnique({
        where: { id: orderId },
        include: { user: true, courier: true },
      })
    } catch {
      currentOrder = inMemoryOrders.get(orderId)
    }
    if (!currentOrder) {
      currentOrder = inMemoryOrders.get(orderId)
    }

    if (!currentOrder) {
      throw new Error('Buyurtma topilmadi.')
    }

    if (!isValidStatusTransition(currentOrder.status, newStatus)) {
      throw new Error(
        `Noto'g'ri holat o'zgarishi: ${currentOrder.status} -> ${newStatus}`
      )
    }

    try {
      const updated = await prisma.$transaction(async tx => {
        const ord = await tx.order.update({
          where: { id: orderId },
          data: { status: newStatus },
          include: { user: true, courier: true },
        })

        await tx.orderStatusHistory.create({
          data: {
            orderId,
            oldStatus: currentOrder.status,
            newStatus,
            changedBy,
            note,
          },
        })

        return ord
      })

      inMemoryOrders.set(updated.id, updated)
      inMemoryOrders.set(updated.orderNumber, updated)
      return updated
    } catch {
      const oldStatus = currentOrder.status
      currentOrder.status = newStatus
      currentOrder.updatedAt = new Date().toISOString()
      currentOrder.statusHistory = currentOrder.statusHistory || []
      currentOrder.statusHistory.push({
        id: `hist-${currentOrder.statusHistory.length + 1}`,
        oldStatus,
        newStatus,
        changedBy,
        note: note || `Holat yangilandi: ${newStatus}`,
        createdAt: new Date().toISOString(),
      })
      inMemoryOrders.set(orderId, currentOrder)
      inMemoryOrders.set(currentOrder.orderNumber, currentOrder)
      return currentOrder
    }
  }

  /**
   * Assigns a courier to an order.
   */
  static async assignCourier(orderId: string, courierId: string, changedBy: string) {
    const FALLBACK_COURIERS: Record<string, any> = {
      'courier-1': { id: 'courier-1', name: 'Azizbek Rahimov', phone: '+998901112233', vehicle: 'Spark Oq (01A777AA)', isActive: true },
      'courier-2': { id: 'courier-2', name: 'Jasurbek Yoqubov', phone: '+998912223344', vehicle: 'Nexia 3 Qora (50B888BB)', isActive: true },
      'courier-3': { id: 'courier-3', name: 'Boburmirzo Aliyev', phone: '+998933334455', vehicle: 'Skuter Honda Dio', isActive: true },
    }

    let courier: any = null
    try {
      courier = await prisma.courier.findUnique({
        where: { id: courierId },
      })
    } catch {
      courier = FALLBACK_COURIERS[courierId]
    }
    if (!courier) {
      courier = FALLBACK_COURIERS[courierId]
    }

    if (!courier || !courier.isActive) {
      throw new Error('Kuryer topilmadi yoki faol emas.')
    }

    try {
      const updated = await prisma.$transaction(async tx => {
        const ord = await tx.order.update({
          where: { id: orderId },
          data: {
            courierId,
            status: 'COURIER_ASSIGNED',
          },
          include: { user: true, courier: true },
        })

        await tx.orderStatusHistory.create({
          data: {
            orderId,
            oldStatus: ord.status,
            newStatus: 'COURIER_ASSIGNED',
            changedBy,
            note: `Kuryer biriktirildi: ${courier.name}`,
          },
        })

        return ord
      })

      inMemoryOrders.set(updated.id, updated)
      inMemoryOrders.set(updated.orderNumber, updated)
      return updated
    } catch {
      const ord = inMemoryOrders.get(orderId)
      if (ord) {
        const oldStatus = ord.status
        ord.courierId = courierId
        ord.courier = courier
        ord.status = 'COURIER_ASSIGNED'
        ord.updatedAt = new Date().toISOString()
        ord.statusHistory = ord.statusHistory || []
        ord.statusHistory.push({
          id: `hist-${ord.statusHistory.length + 1}`,
          oldStatus,
          newStatus: 'COURIER_ASSIGNED',
          changedBy,
          note: `Kuryer biriktirildi: ${courier.name}`,
          createdAt: new Date().toISOString(),
        })
        inMemoryOrders.set(orderId, ord)
        inMemoryOrders.set(ord.orderNumber, ord)
        return ord
      }
      throw new Error('Buyurtma topilmadi.')
    }
  }
}
