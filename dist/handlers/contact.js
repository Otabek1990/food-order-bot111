"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerContactHandler = registerContactHandler;
const telegraf_1 = require("telegraf");
const store_1 = require("../state/store");
const menu_1 = require("./menu");
function registerContactHandler(bot) {
    bot.on('contact', async (ctx) => {
        if (ctx.chat?.type !== 'private')
            return;
        const contact = ctx.message.contact;
        // Xavfsizlik: faqat o'zining kontaktini qabul qilamiz, boshqa odamnikini emas
        if (contact.user_id !== ctx.from.id) {
            await ctx.reply("Iltimos, faqat o'zingizning telefon raqamingizni yuboring.");
            return;
        }
        const session = (0, store_1.getSession)(ctx.from.id);
        session.phone = contact.phone_number;
        session.step = 'idle';
        await ctx.reply('✅ Telefon raqamingiz qabul qilindi!', telegraf_1.Markup.removeKeyboard());
        await (0, menu_1.sendMainMenu)(ctx);
    });
}
