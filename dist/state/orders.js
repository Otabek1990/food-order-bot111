"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = createOrder;
exports.getOrder = getOrder;
exports.getAllOrders = getAllOrders;
exports.getOrdersByStatus = getOrdersByStatus;
exports.updateOrderStatus = updateOrderStatus;
exports.countByStatus = countByStatus;
// Eslatma: store.ts dagi kabi, bu ham in-memory. Production uchun DB bilan
// almashtiriladi (masalan Prisma + PostgreSQL) — qolgan kod o'zgarmasligi uchun
// funksiyalar interfeysi shu ko'rinishda saqlab qolinadi.
const orders = [];
let orderSeq = 1000;
function createOrder(input) {
    const order = {
        id: ++orderSeq,
        status: 'new',
        createdAt: new Date(),
        ...input,
    };
    orders.push(order);
    return order;
}
function getOrder(id) {
    return orders.find((o) => o.id === id);
}
// Eng yangisi birinchi bo'ladigan tartibda
function getAllOrders() {
    return [...orders].sort((a, b) => b.id - a.id);
}
function getOrdersByStatus(status) {
    const list = getAllOrders();
    return status === 'all' ? list : list.filter((o) => o.status === status);
}
function updateOrderStatus(id, status) {
    const order = getOrder(id);
    if (order) {
        order.status = status;
    }
    return order;
}
function countByStatus(status) {
    return orders.filter((o) => o.status === status).length;
}
