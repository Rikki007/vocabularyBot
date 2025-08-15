const { fetchVocabulary } = require('../../services/sheets');
const { generateQuiz } = require('../../utils/wordSelector');
const session = require('../../state/sessionState');

module.exports = (bot) => {
    bot.onText(/\/quiz/, async (msg) => {
        const chatId = msg.chat.id;

        session.irregularQueue = [];
        session.irregularQuizActive = false;

        const words = await fetchVocabulary();
        session.vocabularyQueue = words.sort(() => 0.5 - Math.random());
        session.quizActive = true;

        const quiz = await generateQuiz({ chat: { id: chatId } });
        bot.sendMessage(chatId, quiz.text, quiz.options);
    });
};