const { generateQuiz } = require('../../utils/wordSelector');
const { generateIrrQuiz } = require('../../utils/wordIrrSelector');
const { clue } = require('../../utils/aiResponse');
const { updateRating } = require('../../utils/ratingService');
const session = require('../../state/sessionState');
const idiomsList = require('../../state/idiomsList.json');
const { sendIdiomPreview } = require('../../utils/sendIdiomPreview');

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
                await bot.sendMessage(chatId, `Подсказка:\n${hint}`);
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
                await bot.sendMessage(chatId, `Подсказка:\n${hint}`);
            }

            if (data.startsWith('preview_')) {
                const idiomId = Number(data.replace('preview_', ''));
                sendIdiomPreview(bot, chatId, idiomId, message.message_id);
            }

            if (data.startsWith('details_')) {
                const idiomId = Number(data.replace('details_', ''));
                const idiom = idiomsList.find(i => i.id === idiomId);
                if (!idiom) return;

                const index = idiomsList.findIndex(i => i.id === idiomId);
                const prevId = idiomsList[Math.max(index - 1, 0)].id;
                const nextId = idiomsList[Math.min(index + 1, idiomsList.length - 1)].id;

                const text = `*${idiom.idiom}* — _${idiom.translation}_  
*Meaning:* ${idiom.meaning}  
*Example 1:* ${idiom.example_1}  
*Example 2:* ${idiom.example_2}`;

                bot.editMessageText(text, {
                    chat_id: chatId,
                    message_id: message.message_id,
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '◀️ Предыдущая', callback_data: `preview_${prevId}` }],
                            [{ text: '▶️ Следующая', callback_data: `preview_${nextId}` }]
                        ]
                    }
                });
            }

        } catch (error) {
            console.error('❌ Ошибка в обработке callback_query:', error);
            await bot.sendMessage(query.message.chat.id, '⚠️ Произошла ошибка. Попробуй ещё раз.');
        }
    });
};