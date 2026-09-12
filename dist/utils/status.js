"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_STATUSES = exports.NEXT_STATUS = void 0;
exports.statusLabel = statusLabel;
// Har bir holat uchun ko'rinadigan nom (emoji bilan)
function statusLabel(status) {
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
exports.NEXT_STATUS = {
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
exports.ALL_STATUSES = [
    'new',
    'in_progress',
    'delivering',
    'completed',
    'cancelled',
];
