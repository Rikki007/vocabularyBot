require('dotenv').config();
const axios = require('axios');
const { parse } = require('csv-parse/sync');

const SHEET_URL = process.env.SHEET_URL;

function cleanText(s) {
  return (s || '').trim();
}

async function fetchVocabulary() {
  try {
    const response = await axios.get(SHEET_URL);
    const records = parse(response.data, {
      columns: ['check', 'Word', 'Translation', 'ignored'],
      skip_empty_lines: true,
      from_line: 3,
    });

    const cleanRecords = records
      .filter(r => r.Word?.trim() && r.Translation?.trim())
      .map(r => ({
        word: cleanText(r.Word),
        translation: cleanText(r.Translation),
      }));

    return cleanRecords;
  } catch (error) {
    console.error('Ошибка при загрузке таблицы:', error.message);
    return [];
  }
}

module.exports = { fetchVocabulary };
