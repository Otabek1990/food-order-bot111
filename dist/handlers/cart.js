"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderCart = renderCart;
exports.registerCartHandlers = registerCartHandlers;
const store_1 = require("../state/store");
const keyboards_1 = require("../keyboards");
async function renderCart(ctx) {
    const userId = ctx.from.id;
    const session = (0, store_1.getSession)(userId);
    if (session.cart.length === 0) {
        await ctx.reply("🛒 Savatingiz bo'sh.\n\nMenyudan taom tanlab, savatga qo'shishingiz mumkin.", (0, keyboards_1.cartInline)(false));
        return;
    }
    const lines = session.cart.map((line, i) => {
        const sum = line.price * line.qty;
        return `${i + 1}. ${line.name} — ${line.qty} x ${line.price.toLocaleString('ru-RU')} = ${sum.toLocaleString('ru-RU')} so'm`;
    });
    const total = (0, store_1.cartTotal)(session);
    await ctx.reply(`🛒 <b>Savatingiz:</b>\n\n${lines.join('\n')}\n\n` +
        `<b>Jami: ${total.toLocaleString('ru-RU')} so'm</b>`, { parse_mode: 'HTML', ...(0, keyboards_1.cartInline)(true) });
}
function registerCartHandlers(bot) {
    // "🛒 Savat" tugmasi (menyudan)
    bot.action('cart', async (ctx) => {
        await ctx.answerCbQuery();
        await renderCart(ctx);
    });
    // Savatni tozalash
    bot.action('clear_cart', async (ctx) => {
        await ctx.answerCbQuery("Savat tozalandi");
        (0, store_1.resetCart)(ctx.from.id);
        await renderCart(ctx);
    });
    // Rasmiylashtirish — manzil so'raladi
    bot.action('checkout', async (ctx) => {
        const session = (0, store_1.getSession)(ctx.from.id);
        if (session.cart.length === 0) {
            await ctx.answerCbQuery("Savat bo'sh");
            return;
        }
        await ctx.answerCbQuery();
        session.step = 'awaiting_address';
        await ctx.reply("📍 Buyurtmani rasmiylashtirish uchun yetkazib berish manzilini yozib yuboring.\n\n" +
            "Masalan: <i>Chilonzor tumani, 5-kvartal, 12-uy, 34-xonadon</i>", { parse_mode: 'HTML' });
    });
}
