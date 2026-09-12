"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.phoneRequestKeyboard = phoneRequestKeyboard;
exports.mainMenuInline = mainMenuInline;
exports.productDetailInline = productDetailInline;
exports.cartInline = cartInline;
const telegraf_1 = require("telegraf");
const menu_1 = require("../data/menu");
// Telefon raqam so'rash uchun reply-klaviatura (kontakt yuborish tugmasi)
function phoneRequestKeyboard() {
    return telegraf_1.Markup.keyboard([
        [telegraf_1.Markup.button.contactRequest('📱 Telefon raqamni yuborish')],
    ])
        .resize()
        .oneTime();
}
// Asosiy menyu: har bir taom alohida tugma + savat tugmasi
function mainMenuInline() {
    const rows = menu_1.MENU.map((item) => [
        telegraf_1.Markup.button.callback(`${item.emoji} ${item.name} — ${item.price.toLocaleString('ru-RU')} so'm`, `item_${item.id}`),
    ]);
    rows.push([telegraf_1.Markup.button.callback('🛒 Savat', 'cart')]);
    return telegraf_1.Markup.inlineKeyboard(rows);
}
// Bitta mahsulot ustida turgandagi tugmalar (orqaga qaytish)
function productDetailInline() {
    return telegraf_1.Markup.inlineKeyboard([
        [telegraf_1.Markup.button.callback('◀️ Menyuga qaytish', 'menu')],
    ]);
}
// Savat sahifasidagi tugmalar
function cartInline(hasItems) {
    const rows = [];
    if (hasItems) {
        rows.push([telegraf_1.Markup.button.callback('✅ Rasmiylashtirish', 'checkout')]);
        rows.push([telegraf_1.Markup.button.callback('🗑 Savatni tozalash', 'clear_cart')]);
    }
    rows.push([telegraf_1.Markup.button.callback('◀️ Menyuga qaytish', 'menu')]);
    return telegraf_1.Markup.inlineKeyboard(rows);
}
