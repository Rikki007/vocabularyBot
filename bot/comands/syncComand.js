const { syncVocabulary } = require('../../utils/syncVocabulary');

module.exports = (bot) => {
    bot.onText(/\/sync/, async (msg) => {
        const chatId = msg.chat.id;
        const loading = await bot.sendMessage(chatId, '🔄');

        try {
            const { added, totalAfter } = await syncVocabulary();
            await bot.editMessageText(
                `Словарь синхронизирован. Добавлено новых слов: ${added}. Текущий обьем словаря: ${totalAfter}`,
                { chat_id: chatId, message_id: loading.message_id }
            );
        } catch (err) {
            console.error('Ошибка синхронизации:', err);
            await bot.editMessageText('⚠️ Ошибка синхронизации. Попробуй позже.', {
                chat_id: chatId,
                message_id: loading.message_id
            });
        }
    });
};