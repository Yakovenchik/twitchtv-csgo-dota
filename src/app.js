import { CronJob } from 'cron';
import express from 'express';
import bodyParser from 'body-parser';
import { TWITCH_CLIENT_ID, GAMES_IDS } from './config';
import twitchScrapper from './workers/twitchScraper';
import db from './models';
import streamService from './service/streamService';
import config from './config';

const bootstrap = async() =>  {
  await db.sequelize.sync();
  new CronJob('*/5 * * * *', async function() {
    console.log('Start scraping');
    const totalStreams = await twitchScrapper(TWITCH_CLIENT_ID, Object.values(GAMES_IDS));
    console.log('Scrap finished. Streams:', totalStreams);
  }, null, true, 'UTC', null, true);
};

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get('/dota', async (req, res) => {
  const data = await streamService.getStreams({gameId: config.GAMES_IDS.dota});
  res.send(`<pre>${JSON.stringify(data, null, 4)}</pre>`)
});
app.get('/csgo', async (req, res) => {
  const data = await streamService.getStreams({gameId: config.GAMES_IDS.csgo});
  res.send(`<pre>${JSON.stringify(data, null, 4)}</pre>`)
});

bootstrap().then(() => {
  app.listen(3000, () => {
    console.log('listen')
  });
});
