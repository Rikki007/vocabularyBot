const fs = require('fs').promises;
const path = require('path');

const VOCAB_PATH = path.join(__dirname, '../state/vocabulary.json');

async function loadVocabulary() {
    const data = await fs.readFile(VOCAB_PATH, 'utf-8');
    return JSON.parse(data);
}

async function saveVocabulary(words) {
    await fs.writeFile(VOCAB_PATH, JSON.stringify(words, null, 2), 'utf-8');
}

module.exports = {
  loadVocabulary,
  saveVocabulary
};