// Menyudagi bitta taom
export interface MenuItem {
  id: string;
  name: string;
  price: number; // so'mda
  emoji: string;
}

// Savatdagi bitta qator (tanlangan taom + soni)
export interface CartItem {
  itemId: string;
  name: string;
  price: number;
  qty: number;
}

// Foydalanuvchi qaysi bosqichda turibdi (kutilayotgan keyingi xabar turi)
export type UserStep =
  | 'awaiting_phone'    // telefon raqam kutilmoqda
  | 'idle'              // oddiy holat, menyu bilan ishlayapti
  | 'awaiting_quantity' // mahsulot soni kutilmoqda
  | 'awaiting_address'; // manzil kutilmoqda

// Har bir foydalanuvchi uchun saqlanadigan holat (sessiya)
export interface UserSession {
  phone?: string;
  step: UserStep;
  pendingItemId?: string; // hozir soni kiritilayotgan mahsulot id'si
  cart: CartItem[];
}

// Buyurtma holati (admin panelida boshqariladi)
export type OrderStatus =
  | 'new'         // yangi tushgan
  | 'in_progress' // tayyorlanmoqda
  | 'delivering'  // yetkazilmoqda
  | 'completed'   // yakunlangan
  | 'cancelled';  // bekor qilingan

// Rasmiylashtirilgan buyurtma
export interface Order {
  id: number;
  userId: number;
  userName?: string;
  phone: string;
  address: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
}
