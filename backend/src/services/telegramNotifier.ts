import { InlineKeyboard } from 'grammy'
import { config } from '../config'
import { bot } from '../bot/bot'
import { prisma } from '../database'

export function formatOrderMessage(order: any): string {
  const itemsText = order.items
    .map((item: any) => {
      const extras =
        item.selectedExtras && item.selectedExtras.length > 0
          ? ` (+ ${item.selectedExtras.join(', ')})`
          : ''
      return `• <b>${item.productNameSnapshot}</b> × ${item.quantity}${extras} — ${(item.itemTotal).toLocaleString('uz-UZ')} so'm`
    })
    .join('\n')

  const noteText = order.customerNote ? `\n📝 <b>Izoh:</b> ${order.customerNote}` : ''
  const courierText = order.courier ? `\n🚚 <b>Kuryer:</b> ${order.courier.name} (${order.courier.phone})` : ''

  return `━━━━━━━━━━━━━━━━━━━━━━
🆕 <b>YANGI BUYURTMA #${order.orderNumber}</b>
━━━━━━━━━━━━━━━━━━━━━━
👤 <b>Mijoz:</b> ${order.user?.firstName || 'Mijoz'} ${order.user?.lastName || ''}
📞 <b>Telefon:</b> ${order.phone}
📍 <b>Manzil:</b> ${order.address}${noteText}${courierText}

🍽 <b>Buyurtma tarkibi:</b>
${itemsText}

──────────────────────
💰 <b>Mahsulotlar:</b> ${order.subtotal.toLocaleString('uz-UZ')} so'm
🚗 <b>Yetkazib berish:</b> ${order.deliveryFee.toLocaleString('uz-UZ')} so'm
🎉 <b>Chegirma:</b> ${order.discount.toLocaleString('uz-UZ')} so'm
💵 <b>JAMI: ${order.total.toLocaleString('uz-UZ')} so'm</b>

📦 <b>Holat:</b> ${getStatusBadge(order.status)}
🕐 <b>Vaqt:</b> ${new Date(order.createdAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
━━━━━━━━━━━━━━━━━━━━━━`
}

function getStatusBadge(status: string): string {
  switch (status) {
    case 'PENDING':
      return '⏳ KUTILMOQDA'
    case 'ACCEPTED':
      return '✅ QABUL QILINDI'
    case 'PREPARING':
      return '👨‍🍳 TAYYORLANMOQDA'
    case 'COURIER_ASSIGNED':
      return '🚴 KURYER BIRIKTIRILDI'
    case 'PICKED_UP':
      return '📦 OLIB KETILDI'
    case 'DELIVERING':
      return '🚗 YETKAZILMOQDA'
    case 'DELIVERED':
      return '🎉 YETKAZILDI'
    case 'CANCELLED':
      return '❌ BEKOR QILINDI'
    case 'PROBLEM':
      return '⚠️ MUAMMO BOR'
    default:
      return status
  }
}

export function getOrderKeyboard(orderId: string, status: string): InlineKeyboard {
  const kb = new InlineKeyboard()

  if (status === 'PENDING') {
    kb.text('✅ Qabul qilish', `order_status:${orderId}:ACCEPTED`).text(
      '❌ Bekor qilish',
      `order_status:${orderId}:CANCELLED`
    )
  } else if (status === 'ACCEPTED') {
    kb.text('👨‍🍳 Tayyorlanmoqda', `order_status:${orderId}:PREPARING`).row()
    kb.text('🚚 Kuryer tayinlash', `order_courier_menu:${orderId}`)
  } else if (status === 'PREPARING') {
    kb.text('🚚 Kuryer tayinlash', `order_courier_menu:${orderId}`).row()
    kb.text('📦 Olib ketildi', `order_status:${orderId}:PICKED_UP`)
  } else if (status === 'COURIER_ASSIGNED') {
    kb.text('📦 Olib ketildi', `order_status:${orderId}:PICKED_UP`).row()
    kb.text('🚗 Yetkazilmoqda', `order_status:${orderId}:DELIVERING`)
  } else if (status === 'PICKED_UP') {
    kb.text('🚗 Yetkazilmoqda', `order_status:${orderId}:DELIVERING`).row()
    kb.text('⚠️ Muammo', `order_status:${orderId}:PROBLEM`)
  } else if (status === 'DELIVERING') {
    kb.text('✅ Yetkazildi', `order_status:${orderId}:DELIVERED`).text(
      '⚠️ Muammo',
      `order_status:${orderId}:PROBLEM`
    )
  }

  return kb
}

let resolvedChatId: string | null = null

export class TelegramNotifier {
  /**
   * Posts the order to the restaurant/courier operational Telegram group.
   */
  static async sendOrderToGroup(order: any) {
    if (!config.botToken || !config.ordersChatId) {
      console.warn('⚠️ Telegram Bot Token or Orders Chat ID not configured. Group notification skipped.')
      return
    }

    try {
      const text = formatOrderMessage(order)
      const keyboard = getOrderKeyboard(order.id, order.status)

      const targets: string[] = []
      if (resolvedChatId) {
        targets.push(resolvedChatId)
      } else {
        targets.push(config.ordersChatId)
        if (config.ordersChatId.startsWith('-') && !config.ordersChatId.startsWith('-100')) {
          targets.push('-100' + config.ordersChatId.slice(1))
        } else if (config.ordersChatId.startsWith('-100')) {
          targets.push('-' + config.ordersChatId.slice(4))
        }
      }

      let sentMsg: any = null
      let lastErr: any = null

      for (const target of targets) {
        try {
          sentMsg = await bot.api.sendMessage(target, text, {
            parse_mode: 'HTML',
            reply_markup: keyboard,
          })
          if (sentMsg) {
            resolvedChatId = target
            break
          }
        } catch (e: any) {
          lastErr = e
        }
      }

      if (sentMsg) {
        // Store message ID to allow future inline edits
        try {
          await prisma.order.update({
            where: { id: order.id },
            data: { telegramMessageId: sentMsg.message_id },
          })
        } catch {
          order.telegramMessageId = sentMsg.message_id
        }
      } else if (lastErr) {
        console.warn(`⚠️ Buyurtmani Telegram guruhiga yuborib bo'lmadi (${config.ordersChatId}). Sabab: ${lastErr?.message || lastErr}. Iltimos, @tt_namangan_bot ni ushbu guruhga a'zo yoki admin qilib qo'shing.`)
      }
    } catch (err) {
      console.error('Failed to send order to operational group:', err)
    }
  }

  /**
   * Updates an existing order message in the group with the new status and buttons.
   */
  static async updateGroupOrderMessage(order: any) {
    const targetChatId = resolvedChatId || config.ordersChatId
    if (!config.botToken || !targetChatId || !order.telegramMessageId) {
      return
    }

    try {
      const text = formatOrderMessage(order)
      const keyboard = getOrderKeyboard(order.id, order.status)

      await bot.api.editMessageText(targetChatId, order.telegramMessageId, text, {
        parse_mode: 'HTML',
        reply_markup: keyboard,
      })
    } catch (err) {
      console.error('Failed to edit order message in group:', err)
    }
  }

  /**
   * Sends customer status update notification.
   */
  static async notifyCustomer(telegramId: bigint | number | string, orderNumber: string, status: string) {
    if (!config.botToken || !telegramId) return

    let text = ''
    switch (status) {
      case 'ACCEPTED':
        text = `✅ <b>Buyurtmangiz qabul qilindi!</b>\n\nBuyurtma raqamingiz: <code>#${orderNumber}</code>\nOshpazlarimiz tez orada uni tayyorlashga kirishadi.`
        break
      case 'PREPARING':
        text = `👨‍🍳 <b>Buyurtmangiz tayyorlanmoqda!</b>\n\nBuyurtma: <code>#${orderNumber}</code>\nIssiq va mazali taom tez orada tayyor boʻladi.`
        break
      case 'COURIER_ASSIGNED':
        text = `🚴 <b>Kuryer biriktirildi!</b>\n\nBuyurtma: <code>#${orderNumber}</code>\nKuryerimiz taomni olib siz tomon yo'lga chiqadi.`
        break
      case 'DELIVERING':
        text = `🚗 <b>Buyurtmangiz yo'lda!</b>\n\nBuyurtma: <code>#${orderNumber}</code>\nKuryerimiz tez orada manzilingizga yetib boradi. Iltimos, telefoningizni yoningizda saqlang.`
        break
      case 'DELIVERED':
        text = `🎉 <b>Buyurtmangiz yetkazildi!</b>\n\nBuyurtma: <code>#${orderNumber}</code>\nBizni tanlaganingiz uchun rahmat! Yoqimli ishtaha tilaymiz!`
        break
      case 'CANCELLED':
        text = `❌ <b>Buyurtmangiz bekor qilindi.</b>\n\nBuyurtma: <code>#${orderNumber}</code>\nSavollaringiz bo'lsa, ma'muriyatimiz bilan bog'laning.`
        break
      case 'PROBLEM':
        text = `⚠️ <b>Buyurtmangiz bo'yicha muammo yuzaga keldi.</b>\n\nBuyurtma: <code>#${orderNumber}</code>\nOperatorimiz tez orada siz bilan bog'lanadi.`
        break
      default:
        return
    }

    try {
      await bot.api.sendMessage(Number(telegramId), text, { parse_mode: 'HTML' })
    } catch (err) {
      console.error(`Failed to send status notification to user ${telegramId}:`, err)
    }
  }
}
