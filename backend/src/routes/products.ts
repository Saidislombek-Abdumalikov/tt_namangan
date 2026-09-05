import { Router } from 'express'
import { prisma } from '../database'

export const productsRouter = Router()

export const FALLBACK_PRODUCTS = [
  {
    id: 'osh-1',
    name: "Toshkent To'y Oshi",
    description: "Dumba yog'i, sara mol go'shti, sariq sabzi, no'xat, mayiz va zira bilan damlangan mashhur to'y oshi",
    price: 42000,
    oldPrice: 48000,
    discount: 12,
    category: 'osh',
    image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=400&h=300&fit=crop&auto=format',
    ingredients: ['Lazer guruch', "Mol go'shti", 'Dumba', 'Sariq sabzi', "No'xat", 'Mayiz', 'Zira'],
    extras: [
      { name: "Qazi (2 bo'lak)", price: 12000 },
      { name: 'Bedana tuxumi (2 dona)', price: 4000 },
      { name: 'Achchiq-chuchuk salati', price: 6000 },
    ],
    inStock: true,
  },
  {
    id: 'osh-2',
    name: 'Choyxona Palov',
    description: "Devzira guruch va to'yimli qo'y go'shtidan an'anaviy choyxona uslubida tayyorlangan sersuv osh",
    price: 46000,
    category: 'osh',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop&auto=format',
    ingredients: ['Devzira guruch', "Qo'y go'shti", 'Qizil sabzi', 'Piyoz', 'Sarimsoq', 'Zira'],
    extras: [
      { name: "Qo'shimcha go'sht (100g)", price: 18000 },
      { name: 'Achchiq qalampir', price: 2000 },
    ],
    inStock: true,
  },
  {
    id: 'shash-1',
    name: "Qo'y Go'shti Shashlik",
    description: "Mangal cho'g'ida pishirilgan mayin va sersuv qo'y go'shti dumba bilan",
    price: 24000,
    oldPrice: 28000,
    discount: 14,
    category: 'shashlik',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop&auto=format',
    ingredients: ["Qo'y go'shti", 'Dumba', 'Piyoz', "Ziravorlar to'plami"],
    extras: [
      { name: "Marinadlangan piyoz va ko'katlar", price: 2000 },
      { name: 'Maxsus tomatli sous', price: 3000 },
      { name: 'Tandir non', price: 5000 },
    ],
    inStock: true,
  },
  {
    id: 'shash-2',
    name: 'Qiyma Shashlik',
    description: "Maxsus retsept bo'yicha maydalangan mol go'shti va dumbadan tayyorlangan og'izda eriydigan shashlik",
    price: 19000,
    category: 'shashlik',
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop&auto=format',
    ingredients: ["Mol go'shti qiymasi", 'Dumba', 'Piyoz', 'Zira', 'Murch'],
    extras: [
      { name: "Marinadlangan piyoz", price: 1500 },
      { name: 'Achchiq sous', price: 2500 },
    ],
    inStock: true,
  },
  {
    id: 'somsa-1',
    name: "Tandir Go'shtli Somsa",
    description: "Qatlama xamir, mayda to'g'ralgan mol go'shti, dumba va piyoz bilan tandirda qizartirib pishirilgan",
    price: 12000,
    category: 'somsa',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop&auto=format',
    ingredients: ['Qatlama xamir', "Mol go'shti", 'Dumba', 'Piyoz', 'Sedana'],
    extras: [{ name: 'Achchiq pomidor sousi', price: 2000 }],
    inStock: true,
  },
  {
    id: 'milliy-1',
    name: 'Qozon Kabob',
    description: "Qozonda qizarguncha qovurilgan yosh buzoqcha qovurg'alari va tillarang qovurilgan kartoshka",
    price: 68000,
    oldPrice: 75000,
    discount: 10,
    category: 'milliy',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&auto=format',
    ingredients: ["Mol qovurg'asi", 'Kichik kartoshkalar', 'Piyoz', "Ko'katlar", 'Zira'],
    extras: [
      { name: 'Tandir issiq non', price: 5000 },
      { name: 'Suzma koʻkatlar bilan', price: 5000 },
    ],
    inStock: true,
  },
  {
    id: 'milliy-2',
    name: 'Goʻshtli Manti (4 dona)',
    description: "Yupqa cho'ziluvchan xamir, mayin to'g'ralgan go'sht va dumbadan bug'da pishirilgan manti",
    price: 36000,
    category: 'milliy',
    image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop&auto=format',
    ingredients: ['Yupqa xamir', "Mol go'shti", 'Dumba yogʻi', 'Piyoz', 'Qora murch'],
    extras: [
      { name: 'Smetana / Suzma', price: 4000 },
      { name: 'Qalampirli sous', price: 2000 },
    ],
    inStock: true,
  },
  {
    id: 'lagmon-1',
    name: "Uyg'ur Cho'zma Lag'mon",
    description: "Qo'lda cho'zilgan xamir, sersuv mol go'shti, sabzavotlar va xushbo'y gravyuradan iborat lag'mon",
    price: 38000,
    category: 'lagmon',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&auto=format',
    ingredients: ["Cho'zma xamir", "Mol go'shti", "Bulg'or qalampiri", 'Piyoz', 'Pomidor', 'Seldr'],
    extras: [
      { name: 'Laza (achchiq sous)', price: 2000 },
      { name: "Qo'shimcha go'sht", price: 10000 },
    ],
    inStock: true,
  },
  {
    id: 'ff-1',
    name: 'Pepperoni Pizza',
    description: "Yangi pomidor sousi, mozzarella pishloq va pepperoni bilan tayyorlangan pitsa",
    price: 52000,
    oldPrice: 62000,
    discount: 16,
    category: 'fastfood',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop&auto=format',
    ingredients: ['Mozzarella', 'Pomidor sousi', 'Pepperoni', 'Zaytun', 'Oregano'],
    extras: [
      { name: "Qo'shimcha pishloq", price: 6000 },
      { name: 'Coca-Cola 0.5L', price: 8000 },
    ],
    inStock: true,
  },
  {
    id: 'ff-2',
    name: 'Classic Burger',
    description: "100% sara mol go'shti kotleti, yangi aysberg salati, pomidor va maxsus burger sousi",
    price: 38000,
    oldPrice: 44000,
    discount: 14,
    category: 'fastfood',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&auto=format',
    ingredients: ["Mol go'shti kotleti", 'Salat bargi', 'Pomidor', 'Cheddar pishloq', 'Sous'],
    extras: [
      { name: "Qo'shimcha kotlet", price: 14000 },
      { name: 'Kartoshka fri', price: 9000 },
    ],
    inStock: true,
  },
  {
    id: 'ichim-1',
    name: 'Coca-Cola 0.5L',
    description: 'Muzdek tetiklashtiruvchi klassik gazli ichimlik',
    price: 8000,
    category: 'ichimliklar',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=300&fit=crop&auto=format',
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
