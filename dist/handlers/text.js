"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTextHandler = registerTextHandler;
const store_1 = require("../state/store");
const menu_1 = require("../data/menu");
const keyboards_1 = require("../keyboards");
const orders_1 = require("../state/orders");
const format_1 = require("../utils/format");
const admin_1 = require("../keyboards/admin");
const config_1 = require("../config");
function registerTextHandler(bot) {
    bot.on('text', async (ctx) => {
        // Buyurtma oqimi faqat shaxsiy chatda ishlaydi — guruhdagi oddiy yozishmalarga
        // aralashmaslik uchun. Guruhga faqat tayyor xabarlar (yangi buyurtma) yuboriladi.
        if (ctx.chat?.type !== 'private')
            return;
        const session = (0, store_1.getSession)(ctx.from.id);
        const text = ctx.message.text.trim();
        switch (session.step) {
            case 'awaiting_phone': {
                await ctx.reply("Iltimos, pastdagi \"📱 Telefon raqamni yuborish\" tugmasini bosing.");
                return;
            }
            case 'awaiting_quantity': {
                const qty = Number(text);
                if (!Number.isInteger(qty) || qty <= 0 || qty > 50) {
                    await ctx.reply("Iltimos, to'g'ri son kiriting (masalan: 1, 2, 3 ... 50 gacha).");
                    return;
                }
                const item = session.pendingItemId
                    ? (0, menu_1.findMenuItem)(session.pendingItemId)
                    : undefined;
                if (!item) {
                    await ctx.reply("Xatolik yuz berdi, mahsulot topilmadi. Menyudan qaytadan tanlang.", (0, keyboards_1.mainMenuInline)());
                    session.step = 'idle';
                    return;
                }
                const existingLine = session.cart.find((c) => c.itemId === item.id);
                if (existingLine) {
                    existingLine.qty += qty;
                }
                else {
                    session.cart.push({
                        itemId: item.id,
                        name: item.name,
                        price: item.price,
                        qty,
                    });
                }
                session.step = 'idle';
                session.pendingItemId = undefined;
                await ctx.reply(`✅ ${item.emoji} ${item.name} (${qty} dona) savatga qo'shildi!`, (0, keyboards_1.mainMenuInline)());
                return;
            }
            case 'awaiting_address': {
                if (text.length < 5) {
                    await ctx.reply("Manzil juda qisqa. Iltimos, to'liq manzilni yozing.");
                    return;
                }
                const total = (0, store_1.cartTotal)(session);
                const order = (0, orders_1.createOrder)({
                    userId: ctx.from.id,
                    userName: [ctx.from.first_name, ctx.from.last_name].filter(Boolean).join(' '),
                    phone: session.phone,
                    address: text,
                    items: session.cart,
                    total,
                });
                await ctx.reply(`✅ <b>Buyurtmangiz qabul qilindi!</b>\n\n${(0, format_1.formatOrderFull)(order)}\n\n` +
                    `Tez orada operatorimiz siz bilan bog'lanadi. Xaridingiz uchun rahmat! 🙏`, { parse_mode: 'HTML' });
                // Barcha shaxsiy adminlarga yangi buyurtma haqida darhol xabar beramiz
                for (const adminId of config_1.config.adminIds) {
                    ctx.telegram
                        .sendMessage(adminId, `🆕 <b>Yangi buyurtma!</b>\n\n${(0, format_1.formatOrderFull)(order)}`, {
                        parse_mode: 'HTML',
                        ...(0, admin_1.orderDetailInline)(order),
                    })
                        .catch(() => {
                        // Admin botni bloklagan yoki ID noto'g'ri bo'lsa, e'tiborsiz qoldiramiz
                    });
                }
                // Agar admin guruhi sozlangan bo'lsa, buyurtmani o'sha yerga ham yuboramiz
                if (config_1.config.groupChatId) {
                    ctx.telegram
                        .sendMessage(config_1.config.groupChatId, `🆕 <b>Yangi buyurtma!</b>\n\n${(0, format_1.formatOrderFull)(order)}`, { parse_mode: 'HTML', ...(0, admin_1.orderDetailInline)(order) })
                        .catch((err) => {
                        console.error("Guruhga xabar yuborib bo'lmadi:", err.message ?? err);
                    });
                }
                (0, store_1.resetCart)(ctx.from.id);
                session.step = 'idle';
                return;
            }
            case 'idle':
            default: {
                // Kutilmagan matn — foydalanuvchini menyuga yo'naltiramiz
                await ctx.reply("Menyudan taom tanlang yoki 🛒 Savat tugmasini bosing.", (0, keyboards_1.mainMenuInline)());
                return;
            }
        }
    });
}
