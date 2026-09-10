import { UserSession } from '../types';

// Eslatma: bu oddiy in-memory Map. Bot qayta ishga tushsa, ma'lumotlar o'chadi.
// Production uchun buni Redis yoki DB (Postgres/SQLite) bilan almashtirish tavsiya etiladi,
// lekin interfeys bir xil qolgani uchun handlerlar o'zgarmaydi.
const sessions = new Map<number, UserSession>();

export function getSession(userId: number): UserSession {
  let session = sessions.get(userId);
  if (!session) {
    session = { step: 'awaiting_phone', cart: [] };
    sessions.set(userId, session);
  }
  return session;
}

export function resetCart(userId: number): void {
  const session = getSession(userId);
  session.cart = [];
}

export function cartTotal(session: UserSession): number {
  return session.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}
