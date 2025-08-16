const { irregularVerbs } = require('../../services/irrSheet');
const { generateIrrQuiz } = require('../../utils/wordIrrSelector');
const session = require('../../state/sessionState');

module.exports = (bot) => {
    bot.onText(/\/irr/, async (msg) => {
        const chatId = msg.chat.id;

        session.vocabularyQueue = [];
        session.quizActive = false;

        const words = [...irregularVerbs];
        session.irregularQueue = words.sort(() => 0.5 - Math.random());
        session.irregularQuizActive = true;

        const quiz = await generateIrrQuiz({ chat: { id: chatId } });
        bot.sendMessage(msg.chat.id, quiz.text, quiz.options);
    });
};