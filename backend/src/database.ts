import './config'
import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url:
          process.env.DATABASE_URL ||
          'postgresql://postgres:Saidislom*2008@db.zogqpyaqltjmtczvahmz.supabase.co:5432/postgres',
      },
    },
  })

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

