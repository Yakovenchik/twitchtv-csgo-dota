import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import {db as dbConfig} from '../config';

const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});

const db = {
  createOrUpdate: (modelName, condition, data) => db[modelName]
    .findOne({ where: condition })
    .then(function(obj) {
      if(obj) { // update
        return obj.update(data);
      }
      return db[modelName].create(data);
    })
};
db.sequelize = sequelize;
fs.readdirSync('./src/models').filter((fileName) => fileName !== 'index.js')
  .forEach((fileName) => {
    const model = sequelize.import(path.join(__dirname, fileName));
    db[model.name] = model;
  });

export default db;
