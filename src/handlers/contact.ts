import { Telegraf, Markup } from 'telegraf';
import { getSession } from '../state/store';
import { sendMainMenu } from './menu';

export function registerContactHandler(bot: Telegraf) {
  bot.on('contact', async (ctx) => {
    if (ctx.chat?.type !== 'private') return;

    const contact = ctx.message.contact;

    // Xavfsizlik: faqat o'zining kontaktini qabul qilamiz, boshqa odamnikini emas
    if (contact.user_id !== ctx.from!.id) {
      await ctx.reply(
        "Iltimos, faqat o'zingizning telefon raqamingizni yuboring."
      );
      return;
    }

    const session = getSession(ctx.from!.id);
    session.phone = contact.phone_number;
    session.step = 'idle';

    await ctx.reply(
      '✅ Telefon raqamingiz qabul qilindi!',
      Markup.removeKeyboard()
    );
    await sendMainMenu(ctx);
  });
}
