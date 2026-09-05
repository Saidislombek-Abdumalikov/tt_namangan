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
  const catKombo = await prisma.category.create({
    data: {
      slug: 'kombo',
      name: 'Kombo & Setlar',
      emoji: '🍱',
      sortOrder: 1,
      description: "Do'stlar, radnoylar va oilaviy kombo to'plamlar",
    },
  })

  const catLavash = await prisma.category.create({
    data: {
      slug: 'lavash',
      name: 'Lavashlar',
      emoji: '🌯',
      sortOrder: 2,
      description: "Mol va tovuq go'shtli sersuv tandir lavashlar",
    },
  })

  const catBurger = await prisma.category.create({
    data: {
      slug: 'burger',
      name: 'Burger & Doner',
      emoji: '🍔',
      sortOrder: 3,
      description: "Mazali gamburger, cheeseburger, TT burger va donerlar",
    },
  })

  const catHotdog = await prisma.category.create({
    data: {
      slug: 'hotdog',
      name: 'Hot-doglar',
      emoji: '🌭',
      sortOrder: 4,
      description: "Kanadskiy, amerikano, go'shtli va mangal hot-doglar",
    },
  })

  const catOsh = await prisma.category.create({
    data: {
      slug: 'osh',
      name: 'Osh / Palov',
      emoji: '🥘',
      sortOrder: 5,
      description: "Toshkent to'y oshi va choyxona palov",
    },
  })

  const catShashlik = await prisma.category.create({
    data: {
      slug: 'shashlik',
      name: 'Shashliklar',
      emoji: '🍢',
      sortOrder: 6,
      description: "Mangalda pishirilgan sersuv shashliklar",
    },
  })

  const catSomsa = await prisma.category.create({
    data: {
      slug: 'somsa',
      name: 'Somsalar',
      emoji: '🥟',
      sortOrder: 7,
      description: "Tandir go'shtli va qovoqli qatlama somsalar",
    },
  })

  const catMilliy = await prisma.category.create({
    data: {
      slug: 'milliy',
      name: 'Milliy taomlar',
      emoji: '🍲',
      sortOrder: 8,
      description: "Qozon kabob, manti va sho'rva",
    },
  })

  const catIchimliklar = await prisma.category.create({
    data: {
      slug: 'ichimliklar',
      name: 'Ichimliklar',
      emoji: '🥤',
      sortOrder: 9,
      description: "Salqin ichimliklar, sharbat va choy",
    },
  })

  // 3. Products
  // --- HOT-DOGLAR ---
  await prisma.product.createMany({
    data: [
      {
        categoryId: catHotdog.id,
        name: 'Kanadskiy Hot-dog',
        description: 'Sosiska, xantal, ketchup, mayonez va maxsus bodringli sous',
        price: 15000,
        ingredients: ['Sosiska', 'Bulochka', 'Ketchup', 'Mayonez', 'Xantal'],
        image: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 10,
      },
      {
        categoryId: catHotdog.id,
        name: 'Amerikano Hot-dog',
        description: 'Sersuv sosiska, qarsildoq piyoz, marinadlangan bodring va souslar',
        price: 18000,
        ingredients: ['Sosiska', 'Bulochka', 'Qovurilgan piyoz', 'Marinadlangan bodring'],
        image: 'https://images.unsplash.com/photo-1627059397501-5231c6a287c8?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 10,
      },
      {
        categoryId: catHotdog.id,
        name: "Go'shtli Hot-dog",
        description: "Sara qiyma go'sht, sosiska va maxsus sous bilan boyitilgan hot-dog",
        price: 20000,
        ingredients: ["Qiyma go'sht", 'Sosiska', 'Bulochka', 'Sous'],
        image: 'https://images.unsplash.com/photo-1541214113241-21578d2d9b62?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 10,
      },
      {
        categoryId: catHotdog.id,
        name: 'Longer',
        description: "Uzun qarsildoq bulochka, maxsus go'shtli to'yimli hot-dog",
        price: 25000,
        ingredients: ['Uzun bulochka', 'Sosiska', 'Pishloq', 'Sabzavotlar'],
        image: 'https://images.unsplash.com/photo-1541214113241-21578d2d9b62?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 10,
      },
      {
        categoryId: catHotdog.id,
        name: 'Qazili Hot-dog',
        description: "Haqiqiy ot go'shti qazisi, xantal va maxsus ta'mli souslar uyg'unligi",
        price: 35000,
        ingredients: ['Qazi', 'Bulochka', 'Xantal', 'Mayonez'],
        image: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 12,
      },
      {
        categoryId: catHotdog.id,
        name: 'Mangal Hot-dog 1',
        description: "Mangal cho'g'ida dudlangan sosiska, maxsus mangal sousi va sabzavotlar",
        price: 28000,
        ingredients: ['Dudlangan sosiska', 'Bulochka', 'Mangal sousi'],
        image: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 12,
      },
      {
        categoryId: catHotdog.id,
        name: 'Mangal Hot-dog 2',
        description: "Mangal cho'g'ida pishgan qo'sh sosiska va erigan pishloqli qatlam",
        price: 33000,
        ingredients: ['Qo‘sh sosiska', 'Pishloq', 'Bulochka', 'Sous'],
        image: 'https://images.unsplash.com/photo-1627059397501-5231c6a287c8?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 12,
      },
      {
        categoryId: catHotdog.id,
        name: 'Mangal Hot-dog 3',
        description: "Mangalda pishgan go'sht, sosiska va qarsildoq kartoshka fri bilan",
        price: 38000,
        ingredients: ["Go'sht", 'Sosiska', 'Fri', 'Sous'],
        image: 'https://images.unsplash.com/photo-1627059397501-5231c6a287c8?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 12,
      },
      {
        categoryId: catHotdog.id,
        name: 'Mangal Mix Hot-dog',
        description: "Maxsus Mangal Mix: go'sht, qazi, sosiska va erigan pishloq uyg'unligi",
        price: 43000,
        ingredients: ["Go'sht", 'Qazi', 'Sosiska', 'Pishloq', 'Fri'],
        image: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 15,
      },
    ],
  })

  // --- BURGER & DONER ---
  await prisma.product.createMany({
    data: [
      {
        categoryId: catBurger.id,
        name: 'Gamburger',
        description: "Sara mol go'shti kotleti, barra pomidor, bodring va mayin bulochka",
        price: 28000,
        ingredients: ["Mol go'shti kotleti", 'Bulochka', 'Pomidor', 'Bodring'],
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 12,
      },
      {
        categoryId: catBurger.id,
        name: 'Cheeseburger',
        description: "Mol go'shti kotleti, Chedder pishlog'i, marinadlangan bodring va sous",
        price: 30000,
        ingredients: ["Mol go'shti kotleti", 'Chedder pishloq', 'Bulochka', 'Sous'],
        image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 12,
      },
      {
        categoryId: catBurger.id,
        name: 'TT Burger',
        description: "Maxsus Tezkor Taom burgeri: qo'shaloq kotlet, pishloq, tuxum va sirli sous",
        price: 38000,
        ingredients: ["Qo'shaloq kotlet", 'Pishloq', 'Tuxum', 'Maxsus sous'],
        image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 15,
      },
      {
        categoryId: catBurger.id,
        name: 'Doner',
        description: "Yupqa bulochkada mayin qovurilgan go'sht, barra salat va sharqona sous",
        price: 26000,
        ingredients: ["Go'sht", 'Bulochka', 'Salat', 'Sous'],
        image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 10,
      },
      {
        categoryId: catBurger.id,
        name: 'Doner Sir (Pishloqli)',
        description: "Erigan pishloq, mayin qovurilgan go'sht va maxsus doner sousi",
        price: 28000,
        ingredients: ["Go'sht", 'Erigan pishloq', 'Bulochka', 'Sous'],
        image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 10,
      },
    ],
  })

  // --- LAVASH MOL GO'SHTI ---
  await prisma.product.createMany({
    data: [
      {
        categoryId: catLavash.id,
        name: "Oddiy Lavash (Mol go'shti)",
        description: "Yupqa xamirda sara mol go'shti, pomidor, qarsildoq bodring va mayonez",
        price: 33000,
        ingredients: ["Mol go'shti", 'Lavash xamiri', 'Pomidor', 'Bodring'],
        image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 12,
      },
      {
        categoryId: catLavash.id,
        name: "Lavash Sir (Mol go'shti)",
        description: "Mol go'shti, golland pishlog'i va xushbo'y ziravorlar bilan to'yimli lavash",
        price: 36000,
        ingredients: ["Mol go'shti", 'Pishloq', 'Lavash xamiri', 'Sous'],
        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 12,
      },
      {
        categoryId: catLavash.id,
        name: "Tandir Lavash (Mol go'shti)",
        description: "Tandir cho'g'ida qizartirib pishirilgan qarsildoq va xushta'm tandir lavash",
        price: 39000,
        ingredients: ["Mol go'shti", 'Tandir xamiri', 'Sous'],
        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 14,
      },
      {
        categoryId: catLavash.id,
        name: "Lavash Fri (Mol go'shti)",
        description: "Mol go'shti va qarsildoq kartoshka fri bilan to'ldirilgan to'yimli lavash",
        price: 42000,
        ingredients: ["Mol go'shti", 'Kartoshka fri', 'Lavash xamiri', 'Sous'],
        image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 12,
      },
      {
        categoryId: catLavash.id,
        name: "TT Lavash Big (Mol go'shti)",
        description: "Katta hajm: ko'p go'sht, pishloq, qarsildoq fri va maxsus sirli sous",
        price: 45000,
        ingredients: ["Ko'p mol go'shti", 'Pishloq', 'Fri', 'Maxsus sous'],
        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 15,
      },

      // --- LAVASH TOVUQ GO'SHTI ---
      {
        categoryId: catLavash.id,
        name: 'Oddiy Lavash (Tovuq)',
        description: 'Yumshoq tovuq filesi, barra pomidor, bodring va yengil sous',
        price: 23000,
        ingredients: ['Tovuq filesi', 'Lavash xamiri', 'Pomidor', 'Bodring'],
        image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 10,
      },
      {
        categoryId: catLavash.id,
        name: 'Tandir Lavash (Tovuq)',
        description: 'Tandirda pishirilgan tovuqli lavash, qizarib pishgan qarsildoq xamir',
        price: 28000,
        ingredients: ['Tovuq filesi', 'Tandir xamiri', 'Sous'],
        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 12,
      },
      {
        categoryId: catLavash.id,
        name: 'Tandir Sir (Tovuq)',
        description: "Tandirda erigan pishloq va mayin tovuq filesi uyg'unligi",
        price: 30000,
        ingredients: ['Tovuq filesi', 'Pishloq', 'Tandir xamiri'],
        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 12,
      },
      {
        categoryId: catLavash.id,
        name: 'Tandir + Fri (Tovuq)',
        description: 'Tandirda pishgan tovuqli lavash ichida qarsildoq kartoshka fri',
        price: 33000,
        ingredients: ['Tovuq filesi', 'Fri', 'Tandir xamiri', 'Sous'],
        image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 12,
      },
      {
        categoryId: catLavash.id,
        name: 'TT Lavash Fri + Sir (Tovuq)',
        description: "Tovuq go'shti, qo'shaloq pishloq va fri bilan to'yimli lavash",
        price: 38000,
        ingredients: ['Tovuq filesi', "Qo'shaloq pishloq", 'Fri', 'Sous'],
        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 14,
      },
    ],
  })

  // --- KOMBO VA SETLAR ---
  await prisma.product.createMany({
    data: [
      {
        categoryId: catKombo.id,
        name: "Do'stlar Set",
        description: 'Oddiy lavash 5x, Coca-Cola 1.5L',
        price: 120000,
        image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 20,
      },
      {
        categoryId: catKombo.id,
        name: 'Radnoylar Set',
        description: 'Oddiy lavash 3x, Coca-Cola 1.5L',
        price: 80000,
        image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 15,
      },
      {
        categoryId: catKombo.id,
        name: 'Mix Set',
        description: 'Lavash oddiy 3x, Lavash tovuq 3x, Katta fri 1x, Coca-Cola 1.5L 1x',
        price: 160000,
        image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 25,
      },
      {
        categoryId: catKombo.id,
        name: "KOMBO 3 (Mol Go'shti)",
        description: 'Tandir lavash 3x, Katta fri 1x, Suv 3x',
        price: 140000,
        oldPrice: 152000,
        discount: 8,
        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 18,
      },
      {
        categoryId: catKombo.id,
        name: 'KOMBO 3 (Burger)',
        description: 'Burger 3x, Katta fri 1x, Suv 3x',
        price: 110000,
        oldPrice: 119000,
        discount: 8,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 18,
      },
      {
        categoryId: catKombo.id,
        name: "KOMBO 3 (Tovuq Go'shti)",
        description: 'Tandir lavash 3x, Katta fri 1x, Suv 3x',
        price: 110000,
        oldPrice: 120000,
        discount: 8,
        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 18,
      },
      {
        categoryId: catKombo.id,
        name: "KOMBO 4 (Mol Go'shti)",
        description: 'Tandir lavash 4x, Katta fri 1x, Suv 4x',
        price: 180000,
        oldPrice: 196000,
        discount: 8,
        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 20,
      },
      {
        categoryId: catKombo.id,
        name: 'KOMBO 4 (Burger)',
        description: 'Burger 4x, Katta fri 1x, Suv 4x',
        price: 140000,
        oldPrice: 152000,
        discount: 8,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 20,
      },
      {
        categoryId: catKombo.id,
        name: "KOMBO 4 (Tovuq Go'shti)",
        description: 'Tandir lavash 4x, Katta fri 1x, Suv 4x',
        price: 140000,
        oldPrice: 152000,
        discount: 8,
        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 20,
      },
      {
        categoryId: catKombo.id,
        name: "KOMBO 5 (Mol Go'shti)",
        description: 'Tandir lavash 5x, Katta fri 1x, Cola 1.5L',
        price: 215000,
        oldPrice: 231000,
        discount: 7,
        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 22,
      },
      {
        categoryId: catKombo.id,
        name: 'KOMBO 5 (Burger)',
        description: 'Burger 5x, Katta fri 1x, Cola 1.5L',
        price: 165000,
        oldPrice: 176000,
        discount: 6,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 22,
      },
      {
        categoryId: catKombo.id,
        name: "KOMBO 5 (Tovuq Go'shti)",
        description: 'Tandir lavash 5x, Katta fri 1x, Cola 1.5L',
        price: 165000,
        oldPrice: 176000,
        discount: 6,
        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 22,
      },
    ],
  })

  // --- AN'ANAVIY TAOMLAR ---
  await prisma.product.createMany({
    data: [
      {
        categoryId: catOsh.id,
        name: "Toshkent To'y Oshi",
        description: "Dumba yog'i, sara mol go'shti, sariq sabzi, no'xat, mayiz va zira bilan damlangan mashhur to'y oshi",
        price: 42000,
        oldPrice: 48000,
        discount: 12,
        image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 20,
      },
      {
        categoryId: catOsh.id,
        name: 'Choyxona Palov',
        description: "Devzira guruch va to'yimli qo'y go'shtidan an'anaviy choyxona uslubida tayyorlangan sersuv osh",
        price: 46000,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 25,
      },
      {
        categoryId: catShashlik.id,
        name: "Qo'y Go'shti Shashlik",
        description: "Mangal cho'g'ida pishirilgan mayin va sersuv qo'y go'shti dumba bilan",
        price: 24000,
        oldPrice: 28000,
        discount: 14,
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 15,
      },
      {
        categoryId: catShashlik.id,
        name: 'Qiyma Shashlik',
        description: "Maxsus retsept bo'yicha maydalangan mol go'shti va dumbadan tayyorlangan og'izda eriydigan shashlik",
        price: 19000,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 15,
      },
      {
        categoryId: catSomsa.id,
        name: "Tandir Go'shtli Somsa",
        description: "Qatlama xamir ichida shirali go'sht va piyoz solib tandirda pishirilgan somsa",
        price: 12000,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 10,
      },
      {
        categoryId: catMilliy.id,
        name: 'Qozon Kabob',
        description: "Qozonda qizarguncha qovurilgan yosh buzoqcha qovurg'alari va tillarang kartoshka",
        price: 68000,
        oldPrice: 75000,
        discount: 10,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 25,
      },
      {
        categoryId: catIchimliklar.id,
        name: 'Coca-Cola 1.5L',
        description: 'Katta oilaviy yoki do‘stlar davrasi uchun gazli ichimlik',
        price: 18000,
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 2,
      },
      {
        categoryId: catIchimliklar.id,
        name: 'Coca-Cola 0.5L',
        description: 'Muzdek tetiklashtiruvchi klassik gazli ichimlik',
        price: 8000,
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=300&fit=crop',
        inStock: true,
        preparationTime: 2,
      },
    ],
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
