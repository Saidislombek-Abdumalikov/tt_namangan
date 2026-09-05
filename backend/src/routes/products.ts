import { Router } from 'express'
import { prisma } from '../database'

export const productsRouter = Router()

export const FALLBACK_PRODUCTS = [
  // --- KOMBO VA SETLAR ---
  {
    id: 'kombo-1',
    name: "Do'stlar Set",
    description: 'Oddiy lavash 5x, Coca-Cola 1.5L',
    price: 120000,
    category: 'kombo',
    image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&h=300&fit=crop',
    ingredients: ['Oddiy lavash (5 dona)', 'Coca-Cola 1.5L'],
    extras: [{ name: "Qo'shimcha sous", price: 3000 }],
    inStock: true,
  },
  {
    id: 'kombo-2',
    name: 'Radnoylar Set',
    description: 'Oddiy lavash 3x, Coca-Cola 1.5L',
    price: 80000,
    category: 'kombo',
    image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&h=300&fit=crop',
    ingredients: ['Oddiy lavash (3 dona)', 'Coca-Cola 1.5L'],
    extras: [{ name: "Qo'shimcha sous", price: 3000 }],
    inStock: true,
  },
  {
    id: 'kombo-3',
    name: 'Mix Set',
    description: 'Lavash oddiy 3x, Lavash tovuq 3x, Katta fri 1x, Coca-Cola 1.5L 1x',
    price: 160000,
    category: 'kombo',
    image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&h=300&fit=crop',
    ingredients: ['Mol lavash 3x', 'Tovuq lavash 3x', 'Katta kartoshka fri 1x', 'Coca-Cola 1.5L 1x'],
    extras: [{ name: 'Pishloqli sous', price: 4000 }],
    inStock: true,
  },
  {
    id: 'kombo-k3-mol',
    name: "KOMBO 3 (Mol Go'shti)",
    description: 'Tandir lavash 3x, Katta fri 1x, Suv 3x',
    price: 140000,
    oldPrice: 152000,
    discount: 8,
    category: 'kombo',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
    ingredients: ['Tandir lavash (mol) 3x', 'Katta fri 1x', 'Suv 3x'],
    extras: [{ name: "Pishloq qo'shish", price: 5000 }],
    inStock: true,
  },
  {
    id: 'kombo-k3-bur',
    name: 'KOMBO 3 (Burger)',
    description: 'Burger 3x, Katta fri 1x, Suv 3x',
    price: 110000,
    oldPrice: 119000,
    discount: 8,
    category: 'kombo',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    ingredients: ['Burger 3x', 'Katta fri 1x', 'Suv 3x'],
    extras: [{ name: "Pishloq qo'shish", price: 5000 }],
    inStock: true,
  },
  {
    id: 'kombo-k3-tov',
    name: "KOMBO 3 (Tovuq Go'shti)",
    description: 'Tandir lavash 3x, Katta fri 1x, Suv 3x',
    price: 110000,
    oldPrice: 120000,
    discount: 8,
    category: 'kombo',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
    ingredients: ['Tandir lavash (tovuq) 3x', 'Katta fri 1x', 'Suv 3x'],
    extras: [{ name: "Pishloq qo'shish", price: 5000 }],
    inStock: true,
  },
  // --- BURGER & DONER ---
  {
    id: 'burger-1',
    name: 'Gamburger',
    description: 'Sara mol go\'shti kotleti, barra pomidor, bodring va mayin bulochka',
    price: 28000,
    category: 'burger',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    ingredients: ["Mol go'shti kotleti", 'Bulochka', 'Pomidor', 'Bodring'],
    extras: [{ name: "Pishloq qo'shish", price: 3000 }],
    inStock: true,
  },
  {
    id: 'burger-2',
    name: 'Cheeseburger',
    description: 'Mol go\'shti kotleti, Chedder pishlog\'i, marinadlangan bodring va sous',
    price: 30000,
    category: 'burger',
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=300&fit=crop',
    ingredients: ["Mol go'shti kotleti", 'Chedder pishloq', 'Bulochka', 'Sous'],
    extras: [{ name: "Qo'shimcha kotlet", price: 12000 }],
    inStock: true,
  },
  {
    id: 'burger-3',
    name: 'TT Burger',
    description: 'Maxsus Tezkor Taom burgeri: qo\'shaloq kotlet, pishloq, tuxum va sirli sous',
    price: 38000,
    category: 'burger',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop',
    ingredients: ["Qo'shaloq kotlet", 'Pishloq', 'Tuxum', 'Maxsus sous'],
    extras: [{ name: 'Kartoshka fri', price: 9000 }],
    inStock: true,
  },
  // --- HOT-DOGLAR ---
  {
    id: 'hotdog-1',
    name: 'Kanadskiy Hot-dog',
    description: 'Sosiska, xantal, ketchup, mayonez va maxsus bodringli sous',
    price: 15000,
    category: 'hotdog',
    image: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=400&h=300&fit=crop',
    ingredients: ['Sosiska', 'Bulochka', 'Ketchup', 'Mayonez', 'Xantal'],
    extras: [{ name: "Pishloq qo'shish", price: 3000 }],
    inStock: true,
  },
  {
    id: 'hotdog-2',
    name: 'Amerikano Hot-dog',
    description: 'Sersuv sosiska, qarsildoq piyoz, marinadlangan bodring va souslar',
    price: 18000,
    category: 'hotdog',
    image: 'https://images.unsplash.com/photo-1627059397501-5231c6a287c8?w=400&h=300&fit=crop',
    ingredients: ['Sosiska', 'Bulochka', 'Qovurilgan piyoz', 'Marinadlangan bodring'],
    extras: [{ name: "Pishloq qo'shish", price: 3000 }],
    inStock: true,
  },
  {
    id: 'hotdog-m1',
    name: 'Mangal Hot-dog 1',
    description: 'Mangal cho\'g\'ida dudlangan sosiska, maxsus mangal sousi va sabzavotlar',
    price: 28000,
    category: 'hotdog',
    image: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=400&h=300&fit=crop',
    ingredients: ['Dudlangan sosiska', 'Bulochka', 'Mangal sousi'],
    extras: [{ name: "Pishloq qo'shish", price: 3000 }],
    inStock: true,
  },
  // --- LAVASH ---
  {
    id: 'lavash-mol-1',
    name: "Oddiy Lavash (Mol go'shti)",
    description: 'Yupqa xamirda sara mol go\'shti, pomidor, qarsildoq bodring va mayonez',
    price: 33000,
    category: 'lavash',
    image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&h=300&fit=crop',
    ingredients: ["Mol go'shti", 'Lavash xamiri', 'Pomidor', 'Bodring'],
    extras: [{ name: "Qo'shimcha pishloq", price: 4000 }],
    inStock: true,
  },
  {
    id: 'lavash-mol-3',
    name: "Tandir Lavash (Mol go'shti)",
    description: 'Tandir cho\'g\'ida qizartirib pishirilgan qarsildoq va xushta\'m tandir lavash',
    price: 39000,
    category: 'lavash',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
    ingredients: ["Mol go'shti", 'Tandir xamiri', 'Sous'],
    extras: [{ name: "Qo'shimcha pishloq", price: 4000 }],
    inStock: true,
  },
  {
    id: 'ichim-1',
    name: 'Coca-Cola 1.5L',
    description: 'Katta oilaviy yoki do‘stlar davrasi uchun gazli ichimlik',
    price: 18000,
    category: 'ichimliklar',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=300&fit=crop',
    ingredients: [],
    extras: [],
    inStock: true,
  },
]

/**
 * GET /api/products
 * Returns products with optional category and search filters.
 */
productsRouter.get('/', async (req, res): Promise<void> => {
  const { category, search } = req.query

  try {
    const where: any = {}

    if (category && category !== 'all') {
      where.category = { slug: String(category) }
    }

    if (search) {
      const searchStr = String(search).toLowerCase()
      where.OR = [
        { name: { contains: searchStr, mode: 'insensitive' } },
        { description: { contains: searchStr, mode: 'insensitive' } },
      ]
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
      include: {
        category: true,
        options: true,
      },
    })

    if (products && products.length > 0) {
      const formatted = products.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        oldPrice: p.oldPrice || undefined,
        discount: p.discount || undefined,
        category: p.category.slug,
        image: p.image,
        ingredients: p.ingredients,
        inStock: p.inStock,
        extras: p.options.map(o => ({ name: o.name, price: o.price })),
      }))
      res.json(formatted)
      return
    }
  } catch (error: any) {
    console.warn('DB products query fallback to default seed:', error.message)
  }

  // Fallback to in-memory list
  let list = FALLBACK_PRODUCTS
  if (category && category !== 'all') {
    list = list.filter(p => p.category === category)
  }
  if (search) {
    const s = String(search).toLowerCase()
    list = list.filter(p => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s))
  }

  res.json(list)
})

/**
 * GET /api/products/:id
 */
productsRouter.get('/:id', async (req, res): Promise<void> => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        category: true,
        options: true,
      },
    })

    if (product) {
      res.json({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        oldPrice: product.oldPrice || undefined,
        discount: product.discount || undefined,
        category: product.category.slug,
        image: product.image,
        ingredients: product.ingredients,
        inStock: product.inStock,
        extras: product.options.map(o => ({ name: o.name, price: o.price })),
      })
      return
    }
  } catch (error: any) {
    console.warn('DB single product query fallback:', error.message)
  }

  const found = FALLBACK_PRODUCTS.find(p => p.id === req.params.id)
  if (found) {
    res.json(found)
  } else {
    res.status(404).json({ error: 'Mahsulot topilmadi' })
  }
})
