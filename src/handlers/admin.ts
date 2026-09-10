import { Context, Telegraf } from 'telegraf';
import { isAdmin, config } from '../config';
import { getOrder, getOrdersByStatus, updateOrderStatus } from '../state/orders';
// import { adminHomeInline, orderListInline, orderDetailInline } from '../keyboards/admin';
import { formatOrderFull } from '../utils/format';
import { statusLabel } from '../utils/status';
import { OrderStatus } from '../types';

async function sendAdminHome(ctx: Context) {
  await ctx.reply('🛠 <b>Admin panel</b>\n\nBo\'lim tanlang:', {
    parse_mode: 'HTML',
    // ...adminHomeInline(),
  });
}

// Faqat ADMIN_IDS ro'yxatidagilar uchun ruxsat beruvchi tekshiruv
function assertAdmin(ctx: Context): boolean {
  const userId = ctx.from?.id;
  return !!userId && isAdmin(userId);
}

export function registerAdminHandlers(bot: Telegraf) {
  bot.command('admin', async (ctx) => {
    if (!assertAdmin(ctx)) {
      await ctx.reply("Kechirasiz, bu buyruq faqat administratorlar uchun.");
      return;
    }

    // Admin panel faqat maxsus admin guruhida ishlaydi.
    if (config.groupChatId && ctx.chat.id !== config.groupChatId) {
      await ctx.reply("🛠 Admin panel faqat adminlar guruhida ishlaydi.");
      return;
    }

    await sendAdminHome(ctx);
  });

  bot.action('admin_home', async (ctx) => {
    if (!assertAdmin(ctx)) return ctx.answerCbQuery();
    await ctx.answerCbQuery();
    await sendAdminHome(ctx);
  });

  // admin_list_new, admin_list_in_progress, admin_list_all va h.k.
  bot.action(/^admin_list_(.+)$/, async (ctx) => {
    if (!assertAdmin(ctx)) return ctx.answerCbQuery();
    await ctx.answerCbQuery();

    const statusParam = ctx.match[1] as OrderStatus | 'all';
    const orders = getOrdersByStatus(statusParam);

    if (orders.length === 0) {
      await ctx.reply("Bu bo'limda hozircha buyurtma yo'q.", adminHomeInline());
      return;
    }

    const title =
      statusParam === 'all' ? 'Barcha buyurtmalar' : statusLabel(statusParam);
    await ctx.reply(`📋 <b>${title}</b>`, {
      parse_mode: 'HTML',
      ...orderListInline(orders),
    });
  });

  // Bitta buyurtmani tanlash: order_1001
  bot.action(/^order_(\d+)$/, async (ctx) => {
    if (!assertAdmin(ctx)) return ctx.answerCbQuery();
    await ctx.answerCbQuery();

    const orderId = Number(ctx.match[1]);
    const order = getOrder(orderId);

    if (!order) {
      await ctx.reply('Buyurtma topilmadi.', adminHomeInline());
      return;
    }

    await ctx.reply(formatOrderFull(order), {
      parse_mode: 'HTML',
      ...orderDetailInline(order),
    });
  });

  // Buyurtma holatini o'zgartirish: ord_status_1001_in_progress
  bot.action(/^ord_status_(\d+)_(.+)$/, async (ctx) => {
    if (!assertAdmin(ctx)) return ctx.answerCbQuery();

    const orderId = Number(ctx.match[1]);
    const newStatus = ctx.match[2] as OrderStatus;

    const order = updateOrderStatus(orderId, newStatus);
    if (!order) {
      await ctx.answerCbQuery('Buyurtma topilmadi');
      return;
    }

    await ctx.answerCbQuery(`Holat yangilandi: ${statusLabel(newStatus)}`);

    // Yangilangan tafsilot sahifasini qayta chiqaramiz
    await ctx.editMessageText(formatOrderFull(order), {
      parse_mode: 'HTML',
      ...orderDetailInline(order),
    }).catch(() => {
      // Agar edit qilib bo'lmasa (masalan xabar eskirgan), yangi xabar yuboramiz
      return ctx.reply(formatOrderFull(order), {
        parse_mode: 'HTML',
        ...orderDetailInline(order),
      });
    });

    // Mijozga o'z buyurtmasi holati o'zgargani haqida xabar beramiz
    try {
      await ctx.telegram.sendMessage(
        order.userId,
        `ℹ️ Buyurtmangiz #${order.id} holati yangilandi: <b>${statusLabel(newStatus)}</b>`,
        { parse_mode: 'HTML' }
      );
    } catch {
      // Mijoz botni bloklagan bo'lishi mumkin — bu holatda xatolikni e'tiborsiz qoldiramiz
    }
  });
}
