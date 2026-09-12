"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMainMenu = sendMainMenu;
exports.registerMenuHandlers = registerMenuHandlers;
const store_1 = require("../state/store");
const menu_1 = require("../data/menu");
const keyboards_1 = require("../keyboards");
// Boshqa handlerlardan ham chaqiriladi (start, contact, cart orqaga qaytish)
async function sendMainMenu(ctx) {
    await ctx.reply("🍽 <b>Menyu</b>\n\nKerakli taomni tanlang:", { parse_mode: 'HTML', ...(0, keyboards_1.mainMenuInline)() });
}
// Telefon raqam yuborilmagan foydalanuvchini to'xtatib, qayta so'raydi
async function requirePhone(ctx) {
    const userId = ctx.from?.id;
    if (!userId)
        return false;
    const session = (0, store_1.getSession)(userId);
    if (!session.phone) {
        session.step = 'awaiting_phone';
        await ctx.reply('Davom etish uchun avval telefon raqamingizni yuboring.', (0, keyboards_1.phoneRequestKeyboard)());
        return false;
    }
    return true;
}
function registerMenuHandlers(bot) {
    // "◀️ Menyuga qaytish" tugmasi
    bot.action('menu', async (ctx) => {
        await ctx.answerCbQuery();
        if (!(await requirePhone(ctx)))
            return;
        const session = (0, store_1.getSession)(ctx.from.id);
        session.step = 'idle';
        session.pendingItemId = undefined;
        await sendMainMenu(ctx);
    });
    // Taomlardan biri bosilganda: item_osh, item_lagmon va h.k.
    bot.action(/^item_(.+)$/, async (ctx) => {
        await ctx.answerCbQuery();
        if (!(await requirePhone(ctx)))
            return;
        const itemId = ctx.match[1];
        const item = (0, menu_1.findMenuItem)(itemId);
        if (!item) {
            await ctx.reply('Kechirasiz, bu taom topilmadi.');
            return;
        }
        const session = (0, store_1.getSession)(ctx.from.id);
        session.step = 'awaiting_quantity';
        session.pendingItemId = itemId;
        await ctx.reply(`${item.emoji} <b>${item.name}</b>\n` +
            `Narxi: ${item.price.toLocaleString('ru-RU')} so'm\n\n` +
            `Nechta kerak? Sonini raqam bilan yozing (masalan: 2)`, { parse_mode: 'HTML', ...(0, keyboards_1.productDetailInline)() });
    });
}
