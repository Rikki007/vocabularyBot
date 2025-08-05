require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// Получаем токен из .env
const token = process.env.TELEGRAM_TOKEN;

// Создаём бота в режиме polling
const bot = new TelegramBot(token, { polling: true });

// Обработка команды /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `Привет, ${msg.from.first_name}! Готов учить английский? 🇬🇧`);
});

// Обработка любого текста
bot.on('message', (msg) => {
  if (!msg.text.startsWith('/')) {
    bot.sendMessage(msg.chat.id, `Ты написал: "${msg.text}". Скоро я научу тебя новым словам!`);
  }
});

const { fetchVocabulary } = require('./services/sheets');


bot.onText(/\/word/, async (msg) => {
  const words = await fetchVocabulary();
  const unlearned = words.filter(w => w['✓'] === 'FALSE');

  if (unlearned.length === 0) {
    bot.sendMessage(msg.chat.id, '🎉 Все слова уже выучены!');
    return;
  }

  // Собираем все слова в одну строку
  const message = unlearned
    .map((w, i) => `${i + 1}. ${w.Word} — ${w.Translation}`)
    .join('\n');

  bot.sendMessage(msg.chat.id, `📚 Список слов:\n\n${message}`);
});

