import { Telegraf } from 'telegraf';
import { getSession } from '../state/store';
import { phoneRequestKeyboard } from '../keyboards';
import { sendMainMenu } from './menu';

export function registerStartHandler(bot: Telegraf) {
  bot.start(async (ctx) => {
    // Buyurtma oqimi faqat shaxsiy chatda ishlaydi (guruhda emas)
    if (ctx.chat?.type !== 'private') return;

    const session = getSession(ctx.from!.id);

    if (session.phone) {
      // Foydalanuvchi avval ro'yxatdan o'tgan — to'g'ridan-to'g'ri menyuni ko'rsatamiz
      session.step = 'idle';
      await ctx.reply(`Xush kelibsiz, ${ctx.from!.first_name}! 👋`);
      await sendMainMenu(ctx);
      return;
    }

    session.step = 'awaiting_phone';
    await ctx.reply(
      `Assalomu alaykum, ${ctx.from!.first_name}! 👋\n\n` +
        `Taom buyurtma berish uchun avval telefon raqamingizni yuboring.`,
      phoneRequestKeyboard()
    );
  });
}
