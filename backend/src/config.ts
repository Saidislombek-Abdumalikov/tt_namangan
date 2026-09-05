import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  botToken: process.env.BOT_TOKEN || '8934194891:AAEMFHYLIUaQjLT40QgfS5X8tGOtAoGHjlE',
  ordersChatId: process.env.TELEGRAM_ORDERS_CHAT_ID || '',
  webAppUrl: process.env.WEBAPP_URL || 'https://carie-piddling-nonpurposively.ngrok-free.dev',
  jwtSecret: process.env.JWT_SECRET || 'tt_namangan_secret_key_2026',
}
