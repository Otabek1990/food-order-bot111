"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUtilHandlers = registerUtilHandlers;
// Guruhga qo'shilgandan keyin uning chat_id'sini bilish uchun: guruhda /chatid deb yozish kifoya.
function registerUtilHandlers(bot) {
    bot.command('chatid', async (ctx) => {
        await ctx.reply(`Chat ID: <code>${ctx.chat.id}</code>`, { parse_mode: 'HTML' });
    });
}
