const idiomsList = require('../state/idiomsList.json');

function sendIdiomPreview(bot, chatId, idiomId,  messageId = null) {
    const index = idiomsList.findIndex(i => i.id === idiomId);
    const idiom = idiomsList[index];

    const prevId = idiomsList[Math.max(index - 1, 0)].id;
    const nextId = idiomsList[Math.min(index + 1, idiomsList.length - 1)].id;

    const preview = `*${idiom.idiom}* — _${idiom.translation}_`;

    const options = {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: '◀️ Предыдущая', callback_data: `preview_${prevId}` }],
                [{ text: 'ℹ️ Подробнее', callback_data: `details_${idiom.id}` }],
                [{ text: '▶️ Следующая', callback_data: `preview_${nextId}` }]
            ]
        }
    };

    if (messageId) {
        bot.editMessageText(preview, {
            chat_id: chatId,
            message_id: messageId,
            ...options
        });
    } else {
        bot.sendMessage(chatId, preview, options);
    }
}

module.exports = { sendIdiomPreview };