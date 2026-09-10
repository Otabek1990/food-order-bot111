import { Order, OrderStatus, CartItem } from '../types';

// Eslatma: store.ts dagi kabi, bu ham in-memory. Production uchun DB bilan
// almashtiriladi (masalan Prisma + PostgreSQL) — qolgan kod o'zgarmasligi uchun
// funksiyalar interfeysi shu ko'rinishda saqlab qolinadi.
const orders: Order[] = [];
let orderSeq = 1000;

export interface NewOrderInput {
  userId: number;
  userName?: string;
  phone: string;
  address: string;
  items: CartItem[];
  total: number;
}

export function createOrder(input: NewOrderInput): Order {
  const order: Order = {
    id: ++orderSeq,
    status: 'new',
    createdAt: new Date(),
    ...input,
  };
  orders.push(order);
  return order;
}

export function getOrder(id: number): Order | undefined {
  return orders.find((o) => o.id === id);
}

// Eng yangisi birinchi bo'ladigan tartibda
export function getAllOrders(): Order[] {
  return [...orders].sort((a, b) => b.id - a.id);
}

export function getOrdersByStatus(status: OrderStatus | 'all'): Order[] {
  const list = getAllOrders();
  return status === 'all' ? list : list.filter((o) => o.status === status);
}

export function updateOrderStatus(id: number, status: OrderStatus): Order | undefined {
  const order = getOrder(id);
  if (order) {
    order.status = status;
  }
  return order;
}

export function countByStatus(status: OrderStatus): number {
  return orders.filter((o) => o.status === status).length;
}
