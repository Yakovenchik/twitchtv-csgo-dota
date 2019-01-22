import db from '../models';
import config from '../config';
const gameIdsMap = Object.entries(config.GAMES_IDS).reduce(
        (acc, [gameType, gameId]) => Object.assign(acc, {[gameId]: gameType}),
        {}
    );

async function getStreams(filter) {
    const results = await db.stream.findAll({
        where: { gameId: filter.gameId },
        raw: true,
    } );
    return results.map((stream) =>  Object.assign(stream, {
        gameType: gameIdsMap[stream.gameId]
    }));
}

export default {
    getStreams
};