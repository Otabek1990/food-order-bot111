"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const config_1 = require("./config");
const start_1 = require("./handlers/start");
const contact_1 = require("./handlers/contact");
const menu_1 = require("./handlers/menu");
const cart_1 = require("./handlers/cart");
// import { registerAdminHandlers } from './handlers/admin';
const util_1 = require("./handlers/util");
const text_1 = require("./handlers/text");
const bot = new telegraf_1.Telegraf(config_1.config.botToken);
(0, start_1.registerStartHandler)(bot);
(0, contact_1.registerContactHandler)(bot);
(0, menu_1.registerMenuHandlers)(bot);
(0, cart_1.registerCartHandlers)(bot);
// registerAdminHandlers(bot);
(0, util_1.registerUtilHandlers)(bot);
// Matn handleri eng oxirida ro'yxatdan o'tishi kerak (boshqa handlerlar ishlamasa, shu ishlaydi)
(0, text_1.registerTextHandler)(bot);
bot.catch((err, ctx) => {
    console.error(`Xatolik yuz berdi (update ${ctx.updateType}):`, err);
});
bot.launch().then(() => {
    console.log('🤖 Bot ishga tushdi!');
    console.log('ADMIN_IDS:', config_1.config.adminIds);
    console.log('GROUP_CHAT_ID:', config_1.config.groupChatId ?? '❌ sozlanmagan (.env da yo\'q)');
    if (!config_1.config.groupChatId) {
        console.warn('⚠️ Admin guruhi sozlanmagan: .env faylida GROUP_CHAT_ID kiriting.');
    }
});
// To'g'ri to'xtatish (graceful shutdown)
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
