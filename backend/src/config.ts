import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgresql://postgres:Saidislom*2008@db.zogqpyaqltjmtczvahmz.supabase.co:5432/postgres',
  botToken: process.env.BOT_TOKEN || '8934194891:AAEMFHYLIUaQjLT40QgfS5X8tGOtAoGHjlE',
  ordersChatId: process.env.TELEGRAM_ORDERS_CHAT_ID || '-5397282448',
  webAppUrl: process.env.WEBAPP_URL || 'https://tt-namangan.vercel.app',
  jwtSecret: process.env.JWT_SECRET || 'namangan_secret_super_secure_jwt_token_key_2026',
}

