const axios = require('axios');

let accessToken;
let accessTokenExpiry = 0;

const getAccessToken = async () => {
  const currentTime = Date.now() / 1000;
  if (!accessToken || accessTokenExpiry < currentTime) {
    try {
      const response = await axios.post(
        'https://id.twitch.tv/oauth2/token',
        null,
        {
          params: {
            client_id: process.env.TWITCH_CLIENT_ID,
            client_secret: process.env.TWITCH_CLIENT_SECRET,
            grant_type: 'client_credentials',
          },
        }
      );
      accessToken = response.data.access_token;
      accessTokenExpiry = currentTime + response.data.expires_in;
    } catch (error) {
      console.error('Error fetching access token:', error);
      throw new Error('Failed to get access token');
    }
  }
  return accessToken;
};

const isStreamerOnline = async () => {
  try {
    const token = await getAccessToken();
    const response = await axios.get('https://api.twitch.tv/helix/streams', {
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
      params: {
        user_id: process.env.TWITCH_CHANNEL_ID,
      },
    });

    return response.data.data.length > 0;
  } catch (error) {
    console.error('Error checking stream status:', error);
    throw new Error('Failed to check stream status');
  }
};

const fetchClips = async () => {
  let allClips = [];
  let cursor = null;

  try {
    const token = await getAccessToken();
    do {
      const response = await axios.get('https://api.twitch.tv/helix/clips', {
        headers: {
          'Client-ID': process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${token}`,
        },
        params: {
          broadcaster_id: process.env.TWITCH_CHANNEL_ID,
          first: 100,
          after: cursor,
        },
      });

      allClips = [...allClips, ...response.data.data];
      cursor = response.data.pagination?.cursor;
      console.log('Fetched clips:', response.data.data);
    } while (cursor);

    allClips.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    return allClips;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      const retryAfter = error.response.data.retry_after || 1;
      console.log(`Rate limited. Retrying after ${retryAfter} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
      return fetchClips();
    }
    console.error('Error fetching clips:', error);
    throw new Error('Failed to fetch clips');
  }
};

module.exports = { fetchClips, isStreamerOnline };
