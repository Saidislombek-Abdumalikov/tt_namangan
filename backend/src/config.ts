import dotenv from 'dotenv'

// Guarantee essential production environment variables
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    'postgresql://postgres.zogqpyaqltjmtczvahmz:Saidislom*2008@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true&connect_timeout=20&pool_timeout=20'
}
if (!process.env.BOT_TOKEN) {
  process.env.BOT_TOKEN = '8934194891:AAEMFHYLIUaQjLT40QgfS5X8tGOtAoGHjlE'
}
if (!process.env.TELEGRAM_ORDERS_CHAT_ID) {
  process.env.TELEGRAM_ORDERS_CHAT_ID = '-1003901925817'
}
if (!process.env.WEBAPP_URL) {
  process.env.WEBAPP_URL = 'https://tt-namangan.vercel.app'
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'namangan_secret_super_secure_jwt_token_key_2026'
}

try {
  dotenv.config()
} catch {
  // Ignore in serverless
}

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  botToken: process.env.BOT_TOKEN,
  ordersChatId: process.env.TELEGRAM_ORDERS_CHAT_ID,
  webAppUrl: process.env.WEBAPP_URL,
  jwtSecret: process.env.JWT_SECRET,
}


