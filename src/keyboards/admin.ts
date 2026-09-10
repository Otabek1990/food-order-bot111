import { Markup } from 'telegraf';
import { Order } from '../types';
import { statusLabel, NEXT_STATUS, ALL_STATUSES } from '../utils/status';
import { formatOrderShort } from '../utils/format';
import { countByStatus } from '../state/orders';

// Admin panelning bosh sahifasi: har bir holat bo'yicha son bilan filtr tugmalari
export function adminHomeInline() {
  const rows = ALL_STATUSES.map((status) => [
    Markup.button.callback(
      `${statusLabel(status)} (${countByStatus(status)})`,
      `admin_list_${status}`
    ),
  ]);
  rows.push([Markup.button.callback('📋 Barcha buyurtmalar', 'admin_list_all')]);
  return Markup.inlineKeyboard(rows);
}

// Buyurtmalar ro'yxati (bitta filtr bo'yicha)
export function orderListInline(orders: Order[]) {
  const rows = orders
    .slice(0, 20) // MVP: eng so'nggi 20 tasi
    .map((o) => [Markup.button.callback(formatOrderShort(o), `order_${o.id}`)]);
  // rows.push([Markup.button.callback('◀️ Admin panel', 'admin_home')]);
  return Markup.inlineKeyboard(rows);
}

// Bitta buyurtma tafsilotidagi tugmalar: holatni o'zgartirish + orqaga
export function orderDetailInline(order: Order) {
  const nextOptions = NEXT_STATUS[order.status] ?? [];
  const rows = nextOptions.map((opt) => [
    Markup.button.callback(opt.label, `ord_status_${order.id}_${opt.status}`),
  ]);
  // rows.push([
  //   Markup.button.callback("◀️ Ro'yxatga qaytish", `admin_list_${order.status}`),
  // ]);
  // rows.push([Markup.button.callback('🏠 Admin panel', 'admin_home')]);
  return Markup.inlineKeyboard(rows);
}
