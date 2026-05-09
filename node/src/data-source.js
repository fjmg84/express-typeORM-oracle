const { DataSource } = require('typeorm');
const User = require('./entities/User');

const dataSource = new DataSource({
  type: 'oracle',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 1521,
  username: process.env.DB_USER || 'app_user',
  password: process.env.DB_PASSWORD || 'apppassword',
  serviceName: process.env.DB_SERVICE || 'XE',
  synchronize: true,
  logging: false,
  entities: [User],
  extra: {
    poolMax: 10,
    poolMin: 2,
  },
});

module.exports = dataSource;