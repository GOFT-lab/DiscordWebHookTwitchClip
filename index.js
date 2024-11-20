require('dotenv').config();
const { initDatabase } = require('./database');
const { fetchExistingClips, monitorNewClips } = require('./utils/clipWatcher');

(async () => {
  try {
    await initDatabase();
    console.log('Database connected.');

    setInterval(async () => {
      try {
        await fetchExistingClips();
      } catch (error) {
        console.error('Error in fetchExistingClips:', error);
      }
    }, 5 * 60 * 1000);

    monitorNewClips();
  } catch (error) {
    console.error('Error during bot initialization:', error);
  }
})();
