import { Telegraf } from 'telegraf';

// Guruhga qo'shilgandan keyin uning chat_id'sini bilish uchun: guruhda /chatid deb yozish kifoya.
export function registerUtilHandlers(bot: Telegraf) {
  bot.command('chatid', async (ctx) => {
    await ctx.reply(`Chat ID: <code>${ctx.chat.id}</code>`, { parse_mode: 'HTML' });
  });
}
