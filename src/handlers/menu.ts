import { Context, Telegraf } from 'telegraf';
import { getSession } from '../state/store';
import { findMenuItem } from '../data/menu';
import { mainMenuInline, productDetailInline, phoneRequestKeyboard } from '../keyboards';

// Boshqa handlerlardan ham chaqiriladi (start, contact, cart orqaga qaytish)
export async function sendMainMenu(ctx: Context) {
  await ctx.reply(
    "🍽 <b>Menyu</b>\n\nKerakli taomni tanlang:",
    { parse_mode: 'HTML', ...mainMenuInline() }
  );
}

// Telefon raqam yuborilmagan foydalanuvchini to'xtatib, qayta so'raydi
async function requirePhone(ctx: Context): Promise<boolean> {
  const userId = ctx.from?.id;
  if (!userId) return false;
  const session = getSession(userId);
  if (!session.phone) {
    session.step = 'awaiting_phone';
    await ctx.reply(
      'Davom etish uchun avval telefon raqamingizni yuboring.',
      phoneRequestKeyboard()
    );
    return false;
  }
  return true;
}

export function registerMenuHandlers(bot: Telegraf) {
  // "◀️ Menyuga qaytish" tugmasi
  bot.action('menu', async (ctx) => {
    await ctx.answerCbQuery();
    if (!(await requirePhone(ctx))) return;
    const session = getSession(ctx.from!.id);
    session.step = 'idle';
    session.pendingItemId = undefined;
    await sendMainMenu(ctx);
  });

  // Taomlardan biri bosilganda: item_osh, item_lagmon va h.k.
  bot.action(/^item_(.+)$/, async (ctx) => {
    await ctx.answerCbQuery();
    if (!(await requirePhone(ctx))) return;

    const itemId = ctx.match[1];
    const item = findMenuItem(itemId);
    if (!item) {
      await ctx.reply('Kechirasiz, bu taom topilmadi.');
      return;
    }

    const session = getSession(ctx.from!.id);
    session.step = 'awaiting_quantity';
    session.pendingItemId = itemId;

    await ctx.reply(
      `${item.emoji} <b>${item.name}</b>\n` +
        `Narxi: ${item.price.toLocaleString('ru-RU')} so'm\n\n` +
        `Nechta kerak? Sonini raqam bilan yozing (masalan: 2)`,
      { parse_mode: 'HTML', ...productDetailInline() }
    );
  });
}
