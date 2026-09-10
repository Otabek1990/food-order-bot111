import { Telegraf } from 'telegraf';
import { config } from './config';
import { registerStartHandler } from './handlers/start';
import { registerContactHandler } from './handlers/contact';
import { registerMenuHandlers } from './handlers/menu';
import { registerCartHandlers } from './handlers/cart';
// import { registerAdminHandlers } from './handlers/admin';
import { registerUtilHandlers } from './handlers/util';
import { registerTextHandler } from './handlers/text';

const bot = new Telegraf(config.botToken);

registerStartHandler(bot);
registerContactHandler(bot);
registerMenuHandlers(bot);
registerCartHandlers(bot);
// registerAdminHandlers(bot);
registerUtilHandlers(bot);
// Matn handleri eng oxirida ro'yxatdan o'tishi kerak (boshqa handlerlar ishlamasa, shu ishlaydi)
registerTextHandler(bot);

bot.catch((err, ctx) => {
  console.error(`Xatolik yuz berdi (update ${ctx.updateType}):`, err);
});

bot.launch().then(() => {
  console.log('🤖 Bot ishga tushdi!');
  console.log('ADMIN_IDS:', config.adminIds);
  console.log('GROUP_CHAT_ID:', config.groupChatId ?? '❌ sozlanmagan (.env da yo\'q)');
  if (!config.groupChatId) {
    console.warn('⚠️ Admin guruhi sozlanmagan: .env faylida GROUP_CHAT_ID kiriting.');
  }
});

// To'g'ri to'xtatish (graceful shutdown)
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
