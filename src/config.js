import dotenv from 'dotenv';
dotenv.config();
module.exports = {
  TWITCH_CLIENT_ID: process.env.TWITCH_CLIENT_ID,
  GAMES_IDS: {csgo: 32399, dota: 29595},
  MIN_VIEWERS_COUNT: 100,
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'postgres',
  }
};
