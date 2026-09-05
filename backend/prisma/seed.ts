import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database with traditional Uzbek food & fast food...')

  // Clear existing records
  await prisma.orderStatusHistory.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.productOption.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.courier.deleteMany()

  // 1. Couriers
  await prisma.courier.createMany({
    data: [
      { name: 'Aziz Rahimov', phone: '+998 93 111 22 33', isActive: true },
      { name: 'Bobur Mirzayev', phone: '+998 94 222 33 44', isActive: true },
      { name: 'Sardor Qodirov', phone: '+998 90 333 44 55', isActive: true },
    ],
  })

  // 2. Categories
  const catOsh = await prisma.category.create({
    data: {
      slug: 'osh',
      name: 'Osh / Palov',
      emoji: '🥘',
      sortOrder: 1,
      description: "O'zbek xalqining eng sevimli shoh taomi",
    },
  })

  const catShashlik = await prisma.category.create({
    data: {
      slug: 'shashlik',
      name: 'Shashliklar',
      emoji: '🍢',
      sortOrder: 2,
      description: "Mangalda pishirilgan sersuv shashliklar",
    },
  })

  const catSomsa = await prisma.category.create({
    data: {
      slug: 'somsa',
      name: 'Somsalar',
      emoji: '🥟',
      sortOrder: 3,
      description: "Tandirdan uzilgan qatlama xushbo'y somsalar",
    },
  })

  const catMilliy = await prisma.category.create({
    data: {
      slug: 'milliy',
      name: 'Milliy taomlar',
      emoji: '🍲',
      sortOrder: 4,
      description: "Qozon kabob, manti, sho'rva va tandir non",
    },
  })

  const catLagmon = await prisma.category.create({
    data: {
      slug: 'lagmon',
      name: 'Lagʻmonlar',
      emoji: '🍜',
      sortOrder: 5,
      description: "Cho'zma va qovurma lag'monlar",
    },
  })

  const catFastfood = await prisma.category.create({
    data: {
      slug: 'fastfood',
      name: 'Fast Food',
      emoji: '🍔',
      sortOrder: 6,
      description: "Pitsa, burger va lavashlar",
    },
  })

  const catIchimliklar = await prisma.category.create({
    data: {
      slug: 'ichimliklar',
      name: 'Ichimliklar',
      emoji: '🥤',
      sortOrder: 7,
      description: "Salqin va issiq ichimliklar",
    },
  })

  const catShirinliklar = await prisma.category.create({
    data: {
      slug: 'shirinliklar',
      name: 'Shirinliklar',
      emoji: '🍰',
      sortOrder: 8,
      description: "Namangan paxlavasi va shirinliklar",
    },
  })

  // 3. Products + Options
  // Osh 1
  const osh1 = await prisma.product.create({
    data: {
      categoryId: catOsh.id,
      name: "Toshkent To'y Oshi",
      description: "Dumba yog'i, sara mol go'shti, sariq sabzi, no'xat, mayiz va zira bilan damlangan mashhur to'y oshi",
      price: 42000,
      oldPrice: 48000,
      discount: 12,
      ingredients: ['Lazer guruch', "Mol go'shti", 'Dumba', 'Sariq sabzi', "No'xat", 'Mayiz', 'Zira'],
      image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=400&h=300&fit=crop&auto=format',
      inStock: true,
      preparationTime: 20,
      options: {
        create: [
          { name: "Qazi (2 bo'lak)", price: 12000 },
          { name: 'Bedana tuxumi (2 dona)', price: 4000 },
          { name: 'Achchiq-chuchuk salati', price: 6000 },
        ],
      },
    },
  })

  // Osh 2
  await prisma.product.create({
    data: {
      categoryId: catOsh.id,
      name: 'Choyxona Palov',
      description: "Devzira guruch va to'yimli qo'y go'shtidan an'anaviy choyxona uslubida tayyorlangan sersuv osh",
      price: 46000,
      ingredients: ['Devzira guruch', "Qo'y go'shti", 'Qizil sabzi', 'Piyoz', 'Sarimsoq', 'Zira'],
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop&auto=format',
      inStock: true,
      preparationTime: 25,
      options: {
        create: [
          { name: "Qo'shimcha go'sht (100g)", price: 18000 },
          { name: 'Achchiq qalampir', price: 2000 },
        ],
      },
    },
  })

  // Shashlik 1
  await prisma.product.create({
    data: {
      categoryId: catShashlik.id,
      name: "Qo'y Go'shti Shashlik",
      description: "Mangal cho'g'ida pishirilgan mayin va sersuv qo'y go'shti dumba bilan",
      price: 24000,
      oldPrice: 28000,
      discount: 14,
      ingredients: ["Qo'y go'shti", 'Dumba', 'Piyoz', "Ziravorlar to'plami"],
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop&auto=format',
      inStock: true,
      preparationTime: 15,
      options: {
        create: [
          { name: "Marinadlangan piyoz va ko'katlar", price: 2000 },
          { name: 'Maxsus tomatli sous', price: 3000 },
          { name: 'Tandir non', price: 5000 },
        ],
      },
    },
  })

  // Shashlik 2
  await prisma.product.create({
    data: {
      categoryId: catShashlik.id,
      name: 'Qiyma Shashlik',
      description: "Maxsus retsept bo'yicha maydalangan mol go'shti va dumbadan tayyorlangan og'izda eriydigan shashlik",
      price: 19000,
      ingredients: ["Mol go'shti qiymasi", 'Dumba', 'Piyoz', 'Zira', 'Murch'],
      image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop&auto=format',
      inStock: true,
      preparationTime: 15,
      options: {
        create: [{ name: 'Marinadlangan piyoz', price: 1500 }],
      },
    },
  })

  // Somsa 1
  await prisma.product.create({
    data: {
      categoryId: catSomsa.id,
      name: "Tandir Go'shtli Somsa",
      description: "Qatlama xamir, mayda to'g'ralgan mol go'shti, dumba va piyoz bilan tandirda qizartirib pishirilgan",
      price: 12000,
      ingredients: ['Qatlama xamir', "Mol go'shti", 'Dumba', 'Piyoz', 'Sedana'],
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop&auto=format',
      inStock: true,
      preparationTime: 10,
      options: {
        create: [{ name: 'Achchiq pomidor sousi', price: 2000 }],
      },
    },
  })

  // Milliy 1
  await prisma.product.create({
    data: {
      categoryId: catMilliy.id,
      name: 'Qozon Kabob',
      description: "Qozonda qizarguncha qovurilgan yosh buzoqcha qovurg'alari va tillarang qovurilgan kartoshka",
      price: 68000,
      oldPrice: 75000,
      discount: 10,
      ingredients: ["Mol qovurg'asi", 'Kichik kartoshkalar', 'Piyoz', "Ko'katlar", 'Zira'],
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&auto=format',
      inStock: true,
      preparationTime: 25,
      options: {
        create: [
          { name: 'Tandir issiq non', price: 5000 },
          { name: 'Suzma koʻkatlar bilan', price: 5000 },
        ],
      },
    },
  })

  // Milliy 2 - Manti
  await prisma.product.create({
    data: {
      categoryId: catMilliy.id,
      name: 'Goʻshtli Manti (4 dona)',
      description: "Yupqa cho'ziluvchan xamir, mayin to'g'ralgan go'sht va dumbadan bug'da pishirilgan manti",
      price: 36000,
      ingredients: ['Yupqa xamir', "Mol go'shti", 'Dumba yogʻi', 'Piyoz', 'Qora murch'],
      image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop&auto=format',
      inStock: true,
      preparationTime: 20,
      options: {
        create: [{ name: 'Smetana / Suzma', price: 4000 }],
      },
    },
  })

  // Fastfood
  await prisma.product.create({
    data: {
      categoryId: catFastfood.id,
      name: 'Pepperoni Pizza',
      description: "Yangi pomidor sousi, mozzarella pishloq va pepperoni bilan tayyorlangan mashhur pitsa",
      price: 52000,
      oldPrice: 62000,
      discount: 16,
      ingredients: ['Mozzarella', 'Pomidor sousi', 'Pepperoni', 'Zaytun', 'Oregano'],
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop&auto=format',
      inStock: true,
      preparationTime: 18,
      options: {
        create: [{ name: "Qo'shimcha pishloq", price: 6000 }],
      },
    },
  })

  // Drinks
  await prisma.product.create({
    data: {
      categoryId: catIchimliklar.id,
      name: 'Coca-Cola 0.5L',
      description: 'Muzdek tetiklashtiruvchi klassik gazli ichimlik',
      price: 8000,
      ingredients: [],
      image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=300&fit=crop&auto=format',
      inStock: true,
      preparationTime: 2,
    },
  })

  console.log('Seeding completed successfully!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
