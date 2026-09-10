# Taom Zakaz Telegram Bot

Node.js + TypeScript + Telegraf asosida yozilgan, taom buyurtma qilish uchun Telegram bot.

## O'rnatish

```bash
npm install
cp .env.example .env
# .env faylini oching va BOT_TOKEN qiymatini @BotFather dan olingan token bilan almashtiring
# ADMIN_IDS ga admin panelga kirishi kerak bo'lgan Telegram user_id larni yozing
```

## Admin panel

`ADMIN_IDS` ro'yxatidagi foydalanuvchilar botga `/admin` buyrug'ini yuborib panelni ochadi:

- Buyurtmalar holat bo'yicha ko'rsatiladi: 🆕 Yangi, 🔄 Tayyorlanmoqda, 🚚 Yetkazilmoqda, ✅ Yakunlangan, ❌ Bekor qilingan
- Har bir buyurtmani ochib, holatini tugma orqali o'zgartirish mumkin
- Holat o'zgarganda mijozga avtomatik xabar boradi
- Yangi buyurtma tushganda barcha adminlarga darhol xabar keladi (tugmalar bilan, to'g'ridan-to'g'ri o'sha yerdan holatni o'zgartirish mumkin)

### Admin guruhiga buyurtmalarni chiqarish

1. Botni alohida admin guruhiga **administrator** qilib qo'shing.
2. Guruhda `/chatid` yozib guruh ID'sini oling.
3. `.env` faylida `GROUP_CHAT_ID=<guruh_id>` qilib yozing.
4. Botni qayta ishga tushiring.
5. Yangi zakaz tushganda u avtomatik shu guruhga keladi.
6. Guruhda `/admin` yozsangiz admin panel ochiladi.
7. Buyurtma statusini o'zgartirish tugmalari faqat `ADMIN_IDS` dagi adminlar uchun ishlaydi.

> Eslatma: bot guruhda **admin** bo'lgani uchun Telegram "privacy mode"ni avtomatik o'chiradi, ya'ni bot guruhdagi barcha xabarlarni ko'radi. Shu sababli buyurtma oqimi (`/start`, telefon, savat) atayin faqat **shaxsiy chatda** ishlaydigan qilib yozilgan — guruhdagi oddiy suhbatlarga bot aralashmaydi, faqat tayyor buyurtma xabarlarini yuboradi.

## Ishga tushirish (development)

```bash
npm run dev
```

## Production uchun build

```bash
npm run build
npm start
```

## Loyiha tuzilishi

```
src/
  config.ts            # .env dan BOT_TOKEN, ADMIN_IDS o'qiladi, isAdmin()
  types.ts              # MenuItem, CartItem, UserSession, Order, OrderStatus
  data/menu.ts           # Taomlar ro'yxati (nomi, narxi)
  state/
    store.ts               # Foydalanuvchi sessiyalari (xotirada, Map)
    orders.ts                # Buyurtmalar bazasi (xotirada, Array)
  utils/
    status.ts                # Buyurtma holatlari, keyingi holat qoidalari
    format.ts                 # Buyurtma matnini formatlash
  keyboards/
    index.ts                   # Mijoz uchun klaviaturalar
    admin.ts                    # Admin panel klaviaturalari
  handlers/
    start.ts                     # /start komandasi
    contact.ts                    # Telefon raqamni qabul qilish
    menu.ts                        # Menyuni ko'rsatish, taom tanlash
    cart.ts                         # Savatni ko'rsatish, tozalash, rasmiylashtirish
    admin.ts                         # /admin — buyurtmalarni ko'rish/holatini o'zgartirish
    text.ts                           # Son, manzil kiritish + buyurtmani yaratish
  index.ts                # Botni yig'ish va ishga tushirish
```

## Diqqat

- Foydalanuvchi sessiyalari (`src/state/store.ts`) va buyurtmalar (`src/state/orders.ts`)
  hozircha **xotirada** saqlanadi — bot qayta ishga tushirilsa, barchasi o'chib ketadi.
  Production uchun bu ikki faylni Redis yoki DB (masalan PostgreSQL + Prisma) bilan
  almashtirish tavsiya etiladi; funksiyalar interfeysi bir xil qolgani uchun
  handlerlarni o'zgartirish shart emas.
- Admin panel Telegram bot ichida ishlaydi (`/admin` komandasi), alohida veb-server
  talab qilmaydi. Agar brauzerda ochiladigan veb-dashboard kerak bo'lsa (masalan
  Express + jadval ko'rinishida), buni alohida qo'shib berish mumkin.
