"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminHomeInline = adminHomeInline;
exports.orderListInline = orderListInline;
exports.orderDetailInline = orderDetailInline;
const telegraf_1 = require("telegraf");
const status_1 = require("../utils/status");
const format_1 = require("../utils/format");
const orders_1 = require("../state/orders");
// Admin panelning bosh sahifasi: har bir holat bo'yicha son bilan filtr tugmalari
function adminHomeInline() {
    const rows = status_1.ALL_STATUSES.map((status) => [
        telegraf_1.Markup.button.callback(`${(0, status_1.statusLabel)(status)} (${(0, orders_1.countByStatus)(status)})`, `admin_list_${status}`),
    ]);
    rows.push([telegraf_1.Markup.button.callback('📋 Barcha buyurtmalar', 'admin_list_all')]);
    return telegraf_1.Markup.inlineKeyboard(rows);
}
// Buyurtmalar ro'yxati (bitta filtr bo'yicha)
function orderListInline(orders) {
    const rows = orders
        .slice(0, 20) // MVP: eng so'nggi 20 tasi
        .map((o) => [telegraf_1.Markup.button.callback((0, format_1.formatOrderShort)(o), `order_${o.id}`)]);
    // rows.push([Markup.button.callback('◀️ Admin panel', 'admin_home')]);
    return telegraf_1.Markup.inlineKeyboard(rows);
}
// Bitta buyurtma tafsilotidagi tugmalar: holatni o'zgartirish + orqaga
function orderDetailInline(order) {
    const nextOptions = status_1.NEXT_STATUS[order.status] ?? [];
    const rows = nextOptions.map((opt) => [
        telegraf_1.Markup.button.callback(opt.label, `ord_status_${order.id}_${opt.status}`),
    ]);
    // rows.push([
    //   Markup.button.callback("◀️ Ro'yxatga qaytish", `admin_list_${order.status}`),
    // ]);
    // rows.push([Markup.button.callback('🏠 Admin panel', 'admin_home')]);
    return telegraf_1.Markup.inlineKeyboard(rows);
}
