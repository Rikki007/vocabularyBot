const { fetchVocabulary } = require('../../services/sheets');
const { generateIrrQuiz } = require('../../utils/wordIrrSelector');

module.exports = (bot) => {
    bot.onText(/\/irr/, async (msg) => {
        const quiz = await generateIrrQuiz(msg);
        bot.sendMessage(msg.chat.id, quiz.text, quiz.options);
    });
};