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
          'postgresql://postgres.zogqpyaqltjmtczvahmz:Saidislom*2008@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true&connect_timeout=20&pool_timeout=20',
      },
    },
  })

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

