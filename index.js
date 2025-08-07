require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { fetchVocabulary } = require('./services/sheets');

// Получаем токен из .env
const token = process.env.TELEGRAM_TOKEN;

// Создаём бота в режиме polling
const bot = new TelegramBot(token, { polling: true });

const tableCuerry = async (msg) => {
  const words = await fetchVocabulary();
  const cleanWords = words.filter(w => w.Word?.trim() && w.Translation?.trim());

  // Выбираем случайное слово
  const correct = cleanWords[Math.floor(Math.random() * cleanWords.length)];

  // Получаем случайные неправильные переводы
  const distractors = cleanWords
    .filter(w => w.Translation !== correct.Translation)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  // Собираем варианты
  const options = [...distractors, correct].sort(() => 0.5 - Math.random());

  const buttons = options.map(opt => [{
    text: opt.Translation,
    callback_data: opt.Translation === correct.Translation ? 'correct' : 'wrong'
  }]);

  bot.sendMessage(msg.chat.id, `❓ Что означает слово: *${correct.Word}*`, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: buttons
    }
  });
}

bot.onText(/\/quiz/, tableCuerry);

bot.on('callback_query', async (query) => {
  const { message, data } = query;
  const chatId = message.chat.id;

  const reply = data === 'correct'
    ? '✅ Верно! Молодец!'
    : '❌ Неправильно. Попробуй ещё!';

  bot.sendMessage(chatId, reply);
  if (reply === '✅ Верно! Молодец!') {
      tableCuerry({ chat: { id: chatId } }); // передаём объект с нужной структурой
  }
});