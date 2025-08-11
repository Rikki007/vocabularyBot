const { explanation } = require('../../utils/aiExplanation');
const { translation } = require('../../utils/aiTranslation');
const { fetchVocabulary } = require('../../services/sheets');

module.exports = (bot) => {
    bot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text;

        if (typeof text !== 'string' || text.startsWith('/')) return;

        const recall = await bot.sendMessage(chatId, `Вспоминаю, что это значит.`)
        const explanationOfWord = await explanation(text);
        await bot.editMessageText(`${explanationOfWord}`, {
            chat_id: chatId,
            message_id: recall.message_id,
            parse_mode: 'Markdown'
        });

        if (!explanationOfWord.includes('Слово отсутствует')) {

            const checkVocab = await bot.sendMessage(chatId, `Проверяю твой словарь.`) 
            const words = await fetchVocabulary();

            if (words.some(item => item.Word.trim().toLowerCase() === text.trim().toLowerCase())) {
                await bot.editMessageText(`данное слово присутствует в твоем словаре`, {
                    chat_id: chatId,
                    message_id: checkVocab.message_id,
                    parse_mode: 'Markdown'
                });
            } else {

                const translationOfWord = await translation(text);

                await bot.editMessageText(`Слово *${text}* - *${translationOfWord.trim()}* отсутствует в твоем словаре?`, {
                    chat_id: chatId,
                    message_id: checkVocab.message_id,
                    parse_mode: 'Markdown',
                });
            }
            
        }

    });
};