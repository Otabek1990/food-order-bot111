"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSession = getSession;
exports.resetCart = resetCart;
exports.cartTotal = cartTotal;
// Eslatma: bu oddiy in-memory Map. Bot qayta ishga tushsa, ma'lumotlar o'chadi.
// Production uchun buni Redis yoki DB (Postgres/SQLite) bilan almashtirish tavsiya etiladi,
// lekin interfeys bir xil qolgani uchun handlerlar o'zgarmaydi.
const sessions = new Map();
function getSession(userId) {
    let session = sessions.get(userId);
    if (!session) {
        session = { step: 'awaiting_phone', cart: [] };
        sessions.set(userId, session);
    }
    return session;
}
function resetCart(userId) {
    const session = getSession(userId);
    session.cart = [];
}
function cartTotal(session) {
    return session.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}
