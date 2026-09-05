import express from 'express'
import cors from 'cors'
import { config } from './config'
import { authRouter } from './routes/auth'
import { categoriesRouter } from './routes/categories'
import { productsRouter } from './routes/products'
import { ordersRouter } from './routes/orders'
import { adminRouter } from './routes/admin'
import { bot } from './bot/bot'

// Support BigInt serialization in JSON responses
;(BigInt.prototype as any).toJSON = function () {
  return this.toString()
}

const app = express()

// Middlewares
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'tt-namangan-backend',
    timestamp: new Date().toISOString(),
  })
})

// Routes
app.use('/api/auth', authRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/products', productsRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/admin', adminRouter)

// Start Express Server
const server = app.listen(config.port, () => {
  console.log(`🚀 Namangan Food Backend is running on port ${config.port}`)
  console.log(`📡 Health check: http://localhost:${config.port}/api/health`)
})

// Start Telegram Bot
if (config.botToken && config.botToken !== '123456:dummy_token_for_local_development') {
  bot.start({
    onStart: botInfo => {
      console.log(`🤖 Telegram Bot started as @${botInfo.username}`)
    },
  })
} else {
  console.log('ℹ️ Telegram Bot token not provided or is in dummy mode. Bot polling skipped.')
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...')
  server.close(() => process.exit(0))
})
