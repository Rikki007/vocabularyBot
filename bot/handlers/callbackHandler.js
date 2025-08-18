const { generateQuiz } = require('../../utils/wordSelector');
const { generateIrrQuiz } = require('../../utils/wordIrrSelector');
const { clue } = require('../../utils/aiResponse');
const { updateRating } = require('../../utils/ratingService');
const session = require('../../state/sessionState');

module.exports = (bot) => {
    bot.on('callback_query', async (query) => {
        try {
            const { message, data, id } = query;
            const chatId = message.chat.id;

            await bot.answerCallbackQuery(id);

            if (data === 'correct') {
                await bot.sendMessage(chatId, '✅');

                if (session.lastWord) {
                    await updateRating(session.lastWord.word, 1);
                }

                const quiz = await generateQuiz({ chat: { id: chatId } });
                await bot.sendMessage(chatId, quiz.text, quiz.options);
            }

            if (data === 'wrong') {

                if (session.lastWord) {
                    await updateRating(session.lastWord.word, -2);
                }

                const loadingMessage = await bot.sendMessage(chatId, '🤖');
                const clueToWord = message.text.split(':')[1]?.trim();
                const hint = await clue(clueToWord);
                await bot.deleteMessage(chatId, loadingMessage.message_id);
                await bot.sendMessage(chatId, `💡 Подсказка:\n${hint}`);
            }

            if (data === 'correctIrr') {
                await bot.sendMessage(chatId, '✅');
                const quiz = await generateIrrQuiz({ chat: { id: chatId } });
                await bot.sendMessage(chatId, quiz.text, quiz.options);
            }

            if (data === 'wrongIrr') {
                const loadingMessage = await bot.sendMessage(chatId, '🤖');
                const clueToWord = message.text.split(':')[1].split('-')[0].trim();
                const hint = await clue(clueToWord);
                await bot.deleteMessage(chatId, loadingMessage.message_id);
                await bot.sendMessage(chatId, `💡 Подсказка:\n${hint}`);
            }
        } catch (error) {
            console.error('❌ Ошибка в обработке callback_query:', error);
            await bot.sendMessage(query.message.chat.id, '⚠️ Произошла ошибка. Попробуй ещё раз.');
        }
    });
};