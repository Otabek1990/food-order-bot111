import { OrderStatus } from '../types';

// Har bir holat uchun ko'rinadigan nom (emoji bilan)
export function statusLabel(status: OrderStatus): string {
  switch (status) {
    case 'new':
      return '🆕 Yangi';
    case 'in_progress':
      return '🔄 Tayyorlanmoqda';
    case 'delivering':
      return '🚚 Yetkazilmoqda';
    case 'completed':
      return '✅ Yakunlangan';
    case 'cancelled':
      return '❌ Bekor qilingan';
  }
}

// Har bir holatdan keyin admin bosishi mumkin bo'lgan "keyingi holat" tugmalari
export const NEXT_STATUS: Partial<Record<OrderStatus, { status: OrderStatus; label: string }[]>> = {
  new: [
    { status: 'in_progress', label: '🔄 Tayyorlanmoqda' },
    { status: 'cancelled', label: '❌ Bekor qilish' },
  ],
  in_progress: [
    { status: 'delivering', label: '🚚 Yetkazilmoqda' },
    { status: 'cancelled', label: '❌ Bekor qilish' },
  ],
  delivering: [{ status: 'completed', label: '✅ Yetkazildi' }],
  completed: [],
  cancelled: [],
};

// Admin panel filtr tugmalari uchun barcha holatlar ro'yxati
export const ALL_STATUSES: OrderStatus[] = [
  'new',
  'in_progress',
  'delivering',
  'completed',
  'cancelled',
];
