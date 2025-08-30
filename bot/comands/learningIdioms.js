const { sendIdiomPreview } = require('../../utils/sendIdiomPreview');
const idiomsList = require('../../state/idiomsList.json');

module.exports = (bot) => {
    bot.onText(/\/idiomslearning/, async (msg) => {
        const chatId = msg.chat.id;
        sendIdiomPreview(bot, chatId, idiomsList[0].id);
    });
}