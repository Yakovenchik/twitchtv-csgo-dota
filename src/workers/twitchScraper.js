import request from 'request-promise-native';

import { MIN_VIEWERS_COUNT} from '../config';

import db from '../models';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const uniqueStreams = (data) => {
  const uniqueResults = data.reduce((uniqs, stream) => {
    if (stream.id in uniqs) {
      return uniqs;
    }

    uniqs[stream.id] = stream;
    return uniqs;
  }, {});

  return Object.values(uniqueResults);

};

const requestMakerFactory = (clientId, gamesIds) => (cursor = null) => request({
  method: 'GET',
  url: 'https://api.twitch.tv/helix/streams',
  headers: {
    'Client-ID': clientId
  },
  qs: {
    game_id: gamesIds,
    first: 100,
    after: cursor
  },
  json: true
});

async function scrap(clientId, gameIds) {

  let response;
  let data = [];
  let cursor = null;
  const requestMaker = requestMakerFactory(clientId, gameIds);
  do {
    try {
      response = await requestMaker(cursor);
      const filteredData = response.data.filter(({type, viewer_count}) => type === 'live' && viewer_count >= MIN_VIEWERS_COUNT);
      data = data.concat(filteredData);
      cursor = response.pagination.cursor;
      console.log("finished", cursor)
    } catch(e) {
      if(e.name === "StatusCodeError" && e.error.error === "Too Many Requests"){
        await delay(1000);
        console.log('timeout')
      } else {
        throw(e);
      }
    }
  } while(cursor);

  data = uniqueStreams(data).map((stream) => ({
    id: stream.id,
    title: stream.title,
    date: stream.started_at,
    gameId: stream.game_id,
    viewers: stream.viewer_count
  }));

  const promises = data.map((stream) => db.createOrUpdate(db.stream.name, { id: stream.id}, stream));

  await db.stream.truncate();
  await Promise.all(promises);

  return data.length;

}


export default scrap;
