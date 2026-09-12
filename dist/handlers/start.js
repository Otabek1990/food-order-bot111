"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerStartHandler = registerStartHandler;
const store_1 = require("../state/store");
const keyboards_1 = require("../keyboards");
const menu_1 = require("./menu");
function registerStartHandler(bot) {
    bot.start(async (ctx) => {
        // Buyurtma oqimi faqat shaxsiy chatda ishlaydi (guruhda emas)
        if (ctx.chat?.type !== 'private')
            return;
        const session = (0, store_1.getSession)(ctx.from.id);
        if (session.phone) {
            // Foydalanuvchi avval ro'yxatdan o'tgan — to'g'ridan-to'g'ri menyuni ko'rsatamiz
            session.step = 'idle';
            await ctx.reply(`Xush kelibsiz, ${ctx.from.first_name}! 👋`);
            await (0, menu_1.sendMainMenu)(ctx);
            return;
        }
        session.step = 'awaiting_phone';
        await ctx.reply(`Assalomu alaykum, ${ctx.from.first_name}! 👋\n\n` +
            `Taom buyurtma berish uchun avval telefon raqamingizni yuboring.`, (0, keyboards_1.phoneRequestKeyboard)());
    });
}
