const { isStreamerOnline, fetchClips } = require('../src/twitch');
const { sendClipToDiscord } = require('../src/discordWebhook');
const { Clip } = require('../database');

const fetchExistingClips = async () => {
  const online = await isStreamerOnline();
  if (!online) {
    console.log('Streamer is offline. Skipping clip fetch.');
    return;
  }
  console.log('Streamer online fetch clips');

  const clips = await fetchClips();
  for (const clip of clips) {
    try {
      const exists = await Clip.findOne({ id: clip.id });

      if (!exists) {
        const createdClip = await Clip.create({
          id: clip.id,
          title: clip.title,
          url: clip.url,
          creator: clip.creator_name,
          created_at: new Date(clip.created_at),
        });

        await sendClipToDiscord(createdClip);
      }
    } catch (error) {
      console.error('Error processing clip:', error);
    }
  }
};

const monitorNewClips = async () => {
  setInterval(async () => {
    try {
      const online = await isStreamerOnline();
      if (!online) {
        console.log('Streamer is offline. Skipping new clip monitoring.');
        return;
      }
      console.log('Streamer online fetch clips');

      const clips = await fetchClips();
      for (const clip of clips) {
        try {
          const exists = await Clip.findOne({ id: clip.id });
          if (!exists) {
            const createdClip = await Clip.create({
              id: clip.id,
              title: clip.title,
              url: clip.url,
              creator: clip.creator_name,
              created_at: new Date(clip.created_at),
            });
            await sendClipToDiscord(createdClip);
          }
        } catch (error) {
          console.error('Error processing clip:', error);
        }
      }
    } catch (error) {
      console.error('Error fetching clips:', error);
    }
  }, 3 * 60 * 1000);
};

module.exports = { fetchExistingClips, monitorNewClips };
