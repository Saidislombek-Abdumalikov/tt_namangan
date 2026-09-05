import { Router } from 'express'
import { prisma } from '../database'

export const categoriesRouter = Router()

const FALLBACK_CATEGORIES = [
  { id: 'all', label: 'Hammasi', emoji: '🍽️', productCount: 16 },
  { id: 'osh', label: 'Osh / Palov', emoji: '🥘', productCount: 2 },
  { id: 'shashlik', label: 'Shashliklar', emoji: '🍢', productCount: 3 },
  { id: 'somsa', label: 'Somsalar', emoji: '🥟', productCount: 2 },
  { id: 'milliy', label: 'Milliy taomlar', emoji: '🍲', productCount: 4 },
  { id: 'lagmon', label: 'Lagʻmonlar', emoji: '🍜', productCount: 2 },
  { id: 'fastfood', label: 'Fast Food', emoji: '🍔', productCount: 3 },
  { id: 'ichimliklar', label: 'Ichimliklar', emoji: '🥤', productCount: 3 },
  { id: 'shirinliklar', label: 'Shirinliklar', emoji: '🍰', productCount: 2 },
]

/**
 * GET /api/categories
 * Returns active categories ordered by sortOrder.
 */
categoriesRouter.get('/', async (req, res): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    })

    if (categories && categories.length > 0) {
      const formatted = categories.map(c => ({
        id: c.slug,
        dbId: c.id,
        label: c.name,
        emoji: c.emoji || '🍽️',
        description: c.description,
        image: c.image,
        productCount: c._count.products,
      }))
      res.json(formatted)
      return
    }
  } catch (error: any) {
    console.warn('DB categories query fallback to default seed:', error.message)
  }

  res.json(FALLBACK_CATEGORIES)
})
