const axios = require('axios');

const sendClipToDiscord = async (clip) => {
  const creator = clip.creator || 'Unknown Creator';
  await axios.post(process.env.DISCORD_WEBHOOK_URL, {
    content: `🎥 Кліп: **${clip.title}**  
📽️ Створений: **${creator}**  
🔗 [Посилання на кліп](${clip.url})`,
  });
};

module.exports = { sendClipToDiscord };
