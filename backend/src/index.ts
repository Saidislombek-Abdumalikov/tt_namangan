import { app } from './app'
import { config } from './config'
import { bot } from './bot/bot'

export default app
export { app }

const isVercel = Boolean(process.env.VERCEL)

// Start Express Server and Bot polling locally (skip in Vercel serverless environment)
if (!isVercel) {
  const server = app.listen(config.port, () => {
    console.log(`🚀 Namangan Food Backend is running on port ${config.port}`)
    console.log(`📡 Health check: http://localhost:${config.port}/api/health`)
  })

  // Start Telegram Bot polling locally
  if (config.botToken && config.botToken !== '123456:dummy_token_for_local_development') {
    bot.start({
      onStart: async botInfo => {
        console.log(`🤖 Telegram Bot started as @${botInfo.username}`)
        try {
          await bot.api.setChatMenuButton({
            menu_button: {
              type: 'web_app',
              text: '🍽 Menyu',
              web_app: { url: config.webAppUrl || 'https://tt-namangan.vercel.app' },
            },
          })
          console.log(
            `✅ Telegram global menu button set to: ${config.webAppUrl || 'https://tt-namangan.vercel.app'}`
          )
        } catch (e) {
          console.warn('Could not set global menu button:', e)
        }
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
}
