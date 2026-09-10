import { Markup } from 'telegraf';
import { MENU } from '../data/menu';

// Telefon raqam so'rash uchun reply-klaviatura (kontakt yuborish tugmasi)
export function phoneRequestKeyboard() {
  return Markup.keyboard([
    [Markup.button.contactRequest('📱 Telefon raqamni yuborish')],
  ])
    .resize()
    .oneTime();
}

// Asosiy menyu: har bir taom alohida tugma + savat tugmasi
export function mainMenuInline() {
  const rows = MENU.map((item) => [
    Markup.button.callback(
      `${item.emoji} ${item.name} — ${item.price.toLocaleString('ru-RU')} so'm`,
      `item_${item.id}`
    ),
  ]);
  rows.push([Markup.button.callback('🛒 Savat', 'cart')]);
  return Markup.inlineKeyboard(rows);
}

// Bitta mahsulot ustida turgandagi tugmalar (orqaga qaytish)
export function productDetailInline() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('◀️ Menyuga qaytish', 'menu')],
  ]);
}

// Savat sahifasidagi tugmalar
export function cartInline(hasItems: boolean) {
  const rows = [];
  if (hasItems) {
    rows.push([Markup.button.callback('✅ Rasmiylashtirish', 'checkout')]);
    rows.push([Markup.button.callback('🗑 Savatni tozalash', 'clear_cart')]);
  }
  rows.push([Markup.button.callback('◀️ Menyuga qaytish', 'menu')]);
  return Markup.inlineKeyboard(rows);
}
