require('dotenv').config();
const { initDatabase } = require('./database');
const { fetchExistingClips, monitorNewClips } = require('./utils/clipWatcher');

(async () => {
  await initDatabase();
  console.log('Database connected.');

  setInterval(await fetchExistingClips(), 5 * 60 * 1000);

  monitorNewClips();
})();
