"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatOrderFull = formatOrderFull;
exports.formatOrderShort = formatOrderShort;
const status_1 = require("./status");
function formatMoney(n) {
    return `${n.toLocaleString('ru-RU')} so'm`;
}
// Buyurtmani to'liq ko'rinishda ko'rsatish (mijozga tasdiq, admin uchun detal sahifa)
function formatOrderFull(order) {
    const itemsSummary = order.items
        .map((c) => `• ${c.name} x${c.qty} = ${formatMoney(c.price * c.qty)}`)
        .join('\n');
    const dateStr = order.createdAt.toLocaleString('uz-UZ', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
    return (`🧾 <b>Buyurtma #${order.id}</b>\n` +
        `🕒 ${dateStr}\n` +
        `📞 ${order.phone}\n` +
        `📍 ${order.address}\n\n` +
        `${itemsSummary}\n\n` +
        `<b>Jami: ${formatMoney(order.total)}</b>\n` +
        `Holati: ${(0, status_1.statusLabel)(order.status)}`);
}
// Ro'yxatdagi bitta qator uchun qisqa ko'rinish
function formatOrderShort(order) {
    return `#${order.id} — ${formatMoney(order.total)} — ${(0, status_1.statusLabel)(order.status)}`;
}
