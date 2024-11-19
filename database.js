const mongoose = require('mongoose');

const clipSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  title: String,
  url: String,
  creator: String,
  created_at: { type: Date, required: true },
});

const Clip = mongoose.model('Clip', clipSchema);

const cursorSchema = new mongoose.Schema({
  channel_id: { type: String, required: true, unique: true },
  cursor: { type: String, default: null },
  updated_at: { type: Date, default: Date.now },
});

const Cursor = mongoose.model('TwitchCursor', cursorSchema);

const initDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

module.exports = { Clip, Cursor, initDatabase };
