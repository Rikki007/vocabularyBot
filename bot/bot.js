const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });

require('./comands/quiz')(bot);
require('./comands/quizIrr')(bot);
require('./comands/comands')(bot);
require('./handlers/callbackHandler')(bot);
require('./handlers/messageHandler')(bot);

module.exports = bot;