require('dotenv').config();
const { initDatabase } = require('./database');
const { fetchExistingClips, monitorNewClips } = require('./utils/clipWatcher');

(async () => {
  await initDatabase();
  console.log('Database connected.');

  await fetchExistingClips();

  monitorNewClips();
})();
