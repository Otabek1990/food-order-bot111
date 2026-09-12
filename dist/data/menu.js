"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MENU = void 0;
exports.findMenuItem = findMenuItem;
// MVP uchun statik menyu. Keyinchalik bu yerni DB/JSON fayl bilan almashtirish oson.
exports.MENU = [
    { id: 'osh', name: 'Osh', price: 35000, emoji: '🍚' },
    { id: 'lagmon', name: "Lag'mon", price: 28000, emoji: '🍜' },
    { id: 'shashlik', name: 'Shashlik (jigar)', price: 25000, emoji: '🍢' },
    { id: 'manti', name: 'Manti (5 dona)', price: 22000, emoji: '🥟' },
    { id: 'somsa', name: 'Somsa (1 dona)', price: 8000, emoji: '🥐' },
    { id: 'norin', name: 'Norin', price: 30000, emoji: '🍝' },
    { id: 'salat', name: 'Achchiq-chuchuk salat', price: 12000, emoji: '🥗' },
    { id: 'nonlar', name: 'Non', price: 4000, emoji: '🍞' },
    { id: 'kola', name: 'Coca-Cola 0.5L', price: 9000, emoji: '🥤' },
];
function findMenuItem(id) {
    return exports.MENU.find((item) => item.id === id);
}
