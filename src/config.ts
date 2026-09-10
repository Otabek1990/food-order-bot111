import 'dotenv/config';

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  throw new Error(
    'BOT_TOKEN topilmadi. .env faylini yarating va BOT_TOKEN qiymatini kiriting (.env.example ga qarang).'
  );
}

// ADMIN_IDS=111111111,222222222 kabi vergul bilan ajratilgan Telegram user_id lar
const adminIds = (process.env.ADMIN_IDS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)
  .map(Number)
  .filter((n) => Number.isInteger(n));

// Admin panel va yangi buyurtmalar tushishi kerak bo'lgan guruh/kanal chat_id (manfiy son bo'ladi, masalan -1001234567890)
const groupChatIdRaw = process.env.GROUP_CHAT_ID;
const groupChatId =
  groupChatIdRaw && Number.isInteger(Number(groupChatIdRaw))
    ? Number(groupChatIdRaw)
    : undefined;

export const config = {
  botToken: BOT_TOKEN,
  adminIds,
  groupChatId,
};

export function isAdmin(userId: number): boolean {
  return config.adminIds.includes(userId);
}
