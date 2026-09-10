import { Telegraf } from 'telegraf';
import { getSession, resetCart, cartTotal } from '../state/store';
import { findMenuItem } from '../data/menu';
import { mainMenuInline } from '../keyboards';
import { createOrder } from '../state/orders';
import { formatOrderFull } from '../utils/format';
import { orderDetailInline } from '../keyboards/admin';
import { config } from '../config';

export function registerTextHandler(bot: Telegraf) {
  bot.on('text', async (ctx) => {
    // Buyurtma oqimi faqat shaxsiy chatda ishlaydi — guruhdagi oddiy yozishmalarga
    // aralashmaslik uchun. Guruhga faqat tayyor xabarlar (yangi buyurtma) yuboriladi.
    if (ctx.chat?.type !== 'private') return;

    const session = getSession(ctx.from!.id);
    const text = ctx.message.text.trim();

    switch (session.step) {
      case 'awaiting_phone': {
        await ctx.reply(
          "Iltimos, pastdagi \"📱 Telefon raqamni yuborish\" tugmasini bosing."
        );
        return;
      }

      case 'awaiting_quantity': {
        const qty = Number(text);
        if (!Number.isInteger(qty) || qty <= 0 || qty > 50) {
          await ctx.reply(
            "Iltimos, to'g'ri son kiriting (masalan: 1, 2, 3 ... 50 gacha)."
          );
          return;
        }

        const item = session.pendingItemId
          ? findMenuItem(session.pendingItemId)
          : undefined;

        if (!item) {
          await ctx.reply(
            "Xatolik yuz berdi, mahsulot topilmadi. Menyudan qaytadan tanlang.",
            mainMenuInline()
          );
          session.step = 'idle';
          return;
        }

        const existingLine = session.cart.find((c) => c.itemId === item.id);
        if (existingLine) {
          existingLine.qty += qty;
        } else {
          session.cart.push({
            itemId: item.id,
            name: item.name,
            price: item.price,
            qty,
          });
        }

        session.step = 'idle';
        session.pendingItemId = undefined;

        await ctx.reply(
          `✅ ${item.emoji} ${item.name} (${qty} dona) savatga qo'shildi!`,
          mainMenuInline()
        );
        return;
      }

      case 'awaiting_address': {
        if (text.length < 5) {
          await ctx.reply(
            "Manzil juda qisqa. Iltimos, to'liq manzilni yozing."
          );
          return;
        }

        const total = cartTotal(session);

        const order = createOrder({
          userId: ctx.from!.id,
          userName: [ctx.from!.first_name, ctx.from!.last_name].filter(Boolean).join(' '),
          phone: session.phone!,
          address: text,
          items: session.cart,
          total,
        });

        await ctx.reply(
          `✅ <b>Buyurtmangiz qabul qilindi!</b>\n\n${formatOrderFull(order)}\n\n` +
            `Tez orada operatorimiz siz bilan bog'lanadi. Xaridingiz uchun rahmat! 🙏`,
          { parse_mode: 'HTML' }
        );

        // Barcha shaxsiy adminlarga yangi buyurtma haqida darhol xabar beramiz
        for (const adminId of config.adminIds) {
          ctx.telegram
            .sendMessage(adminId, `🆕 <b>Yangi buyurtma!</b>\n\n${formatOrderFull(order)}`, {
              parse_mode: 'HTML',
              ...orderDetailInline(order),
            })
            .catch(() => {
              // Admin botni bloklagan yoki ID noto'g'ri bo'lsa, e'tiborsiz qoldiramiz
            });
        }

        // Agar admin guruhi sozlangan bo'lsa, buyurtmani o'sha yerga ham yuboramiz
        if (config.groupChatId) {
          ctx.telegram
            .sendMessage(
              config.groupChatId,
              `🆕 <b>Yangi buyurtma!</b>\n\n${formatOrderFull(order)}`,
              { parse_mode: 'HTML', ...orderDetailInline(order) }
            )
            .catch((err) => {
              console.error("Guruhga xabar yuborib bo'lmadi:", err.message ?? err);
            });
        }

        resetCart(ctx.from!.id);
        session.step = 'idle';
        return;
      }

      case 'idle':
      default: {
        // Kutilmagan matn — foydalanuvchini menyuga yo'naltiramiz
        await ctx.reply(
          "Menyudan taom tanlang yoki 🛒 Savat tugmasini bosing.",
          mainMenuInline()
        );
        return;
      }
    }
  });
}
