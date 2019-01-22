const Stream = (sequelize, DataTypes) => sequelize.define('stream', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING
  },
  date: {
    type: DataTypes.DATE
  },
  viewers: {
    type: DataTypes.INTEGER
  },
  gameId: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'streams'
});


export default Stream;
