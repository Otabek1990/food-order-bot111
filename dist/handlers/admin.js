"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAdminHandlers = registerAdminHandlers;
const config_1 = require("../config");
const orders_1 = require("../state/orders");
// import { adminHomeInline, orderListInline, orderDetailInline } from '../keyboards/admin';
const format_1 = require("../utils/format");
const status_1 = require("../utils/status");
const admin_1 = require("../keyboards/admin");
async function sendAdminHome(ctx) {
    await ctx.reply('🛠 <b>Admin panel</b>\n\nBo\'lim tanlang:', {
        parse_mode: 'HTML',
        // ...adminHomeInline(),
    });
}
// Faqat ADMIN_IDS ro'yxatidagilar uchun ruxsat beruvchi tekshiruv
function assertAdmin(ctx) {
    const userId = ctx.from?.id;
    return !!userId && (0, config_1.isAdmin)(userId);
}
function registerAdminHandlers(bot) {
    bot.command('admin', async (ctx) => {
        if (!assertAdmin(ctx)) {
            await ctx.reply("Kechirasiz, bu buyruq faqat administratorlar uchun.");
            return;
        }
        // Admin panel faqat maxsus admin guruhida ishlaydi.
        if (config_1.config.groupChatId && ctx.chat.id !== config_1.config.groupChatId) {
            await ctx.reply("🛠 Admin panel faqat adminlar guruhida ishlaydi.");
            return;
        }
        await sendAdminHome(ctx);
    });
    bot.action('admin_home', async (ctx) => {
        if (!assertAdmin(ctx))
            return ctx.answerCbQuery();
        await ctx.answerCbQuery();
        await sendAdminHome(ctx);
    });
    // admin_list_new, admin_list_in_progress, admin_list_all va h.k.
    bot.action(/^admin_list_(.+)$/, async (ctx) => {
        if (!assertAdmin(ctx))
            return ctx.answerCbQuery();
        await ctx.answerCbQuery();
        const statusParam = ctx.match[1];
        const orders = (0, orders_1.getOrdersByStatus)(statusParam);
        if (orders.length === 0) {
            await ctx.reply("Bu bo'limda hozircha buyurtma yo'q.", (0, admin_1.adminHomeInline)());
            return;
        }
        const title = statusParam === 'all' ? 'Barcha buyurtmalar' : (0, status_1.statusLabel)(statusParam);
        await ctx.reply(`📋 <b>${title}</b>`, {
            parse_mode: 'HTML',
            ...(0, admin_1.orderListInline)(orders),
        });
    });
    // Bitta buyurtmani tanlash: order_1001
    bot.action(/^order_(\d+)$/, async (ctx) => {
        if (!assertAdmin(ctx))
            return ctx.answerCbQuery();
        await ctx.answerCbQuery();
        const orderId = Number(ctx.match[1]);
        const order = (0, orders_1.getOrder)(orderId);
        if (!order) {
            await ctx.reply('Buyurtma topilmadi.', (0, admin_1.adminHomeInline)());
            return;
        }
        await ctx.reply((0, format_1.formatOrderFull)(order), {
            parse_mode: 'HTML',
            ...(0, admin_1.orderDetailInline)(order),
        });
    });
    // Buyurtma holatini o'zgartirish: ord_status_1001_in_progress
    bot.action(/^ord_status_(\d+)_(.+)$/, async (ctx) => {
        if (!assertAdmin(ctx))
            return ctx.answerCbQuery();
        const orderId = Number(ctx.match[1]);
        const newStatus = ctx.match[2];
        const order = (0, orders_1.updateOrderStatus)(orderId, newStatus);
        if (!order) {
            await ctx.answerCbQuery('Buyurtma topilmadi');
            return;
        }
        await ctx.answerCbQuery(`Holat yangilandi: ${(0, status_1.statusLabel)(newStatus)}`);
        // Yangilangan tafsilot sahifasini qayta chiqaramiz
        await ctx.editMessageText((0, format_1.formatOrderFull)(order), {
            parse_mode: 'HTML',
            ...(0, admin_1.orderDetailInline)(order),
        }).catch(() => {
            // Agar edit qilib bo'lmasa (masalan xabar eskirgan), yangi xabar yuboramiz
            return ctx.reply((0, format_1.formatOrderFull)(order), {
                parse_mode: 'HTML',
                ...(0, admin_1.orderDetailInline)(order),
            });
        });
        // Mijozga o'z buyurtmasi holati o'zgargani haqida xabar beramiz
        try {
            await ctx.telegram.sendMessage(order.userId, `ℹ️ Buyurtmangiz #${order.id} holati yangilandi: <b>${(0, status_1.statusLabel)(newStatus)}</b>`, { parse_mode: 'HTML' });
        }
        catch {
            // Mijoz botni bloklagan bo'lishi mumkin — bu holatda xatolikni e'tiborsiz qoldiramiz
        }
    });
}
