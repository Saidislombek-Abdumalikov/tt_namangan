import express from 'express'
import cors from 'cors'
import { config } from './config'
import { authRouter } from './routes/auth'
import { categoriesRouter } from './routes/categories'
import { productsRouter } from './routes/products'
import { ordersRouter } from './routes/orders'
import { adminRouter } from './routes/admin'
import { bot } from './bot/bot'
import { webhookCallback } from 'grammy'

// Support BigInt serialization in JSON responses
;(BigInt.prototype as any).toJSON = function () {
  return this.toString()
}

const app = express()

// Middlewares
app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ limit: '20mb' }))
app.use(express.urlencoded({ extended: true, limit: '20mb' }))

// Health check
app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    status: 'ok',
    service: 'tt-namangan-backend',
    timestamp: new Date().toISOString(),
  })
})

// Webhook setup helper endpoint
app.get(['/api/bot/setup', '/bot/setup'], async (req, res) => {
  try {
    const webhookUrl = `${config.webAppUrl}/api/bot`
    await bot.api.setWebhook(webhookUrl)
    await bot.api.setChatMenuButton({
      menu_button: {
        type: 'web_app',
        text: '🍽 Menyuni ochish',
        web_app: { url: config.webAppUrl },
      },
    })
    res.json({
      success: true,
      webhookUrl,
      menuUrl: config.webAppUrl,
      timestamp: new Date().toISOString(),
    })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// Telegram Bot Webhook endpoint
app.use(['/api/bot', '/bot'], webhookCallback(bot, 'express'))

// API Routes
app.use(['/api/auth', '/auth'], authRouter)
app.use(['/api/categories', '/categories'], categoriesRouter)
app.use(['/api/products', '/products'], productsRouter)
app.use(['/api/orders', '/orders'], ordersRouter)
app.use(['/api/admin', '/admin'], adminRouter)

// Default catch-all for unknown API routes
app.all(['/api/*', '/api'], (req, res) => {
  res.status(404).json({ error: `Not Found: ${req.method} ${req.originalUrl}` })
})

export default app
export { app }
