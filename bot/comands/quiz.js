const fs = require('fs').promises;
const path = require('path');
const { generateQuiz } = require('../../utils/wordSelector');
const session = require('../../state/sessionState');
const { ratingTracker } = require('../../utils/ratingDecay');

const VOCAB_PATH = path.join(__dirname, '../../state/vocabulary.json');

async function loadVocabulary() {
  const data = await fs.readFile(VOCAB_PATH, 'utf-8');
  return JSON.parse(data);
}

module.exports = (bot) => {
  bot.onText(/\/quiz/, async (msg) => {
    const chatId = msg.chat.id;

    session.irregularQueue = [];
    session.irregularQuizActive = false;

    await ratingTracker();

    const words = await loadVocabulary();

    const lowest20 = [...words].sort((a, b) => a.rating - b.rating).slice(0, 20);

    session.vocabularyQueue = lowest20;
    session.quizActive = true;

    const quiz = await generateQuiz({ chat: { id: chatId } });
    bot.sendMessage(chatId, quiz.text, quiz.options);
  });
};
