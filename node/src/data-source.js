const { DataSource } = require('typeorm');
const User = require('./entities/User');

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USER || 'app_user',
  password: process.env.DB_PASSWORD || 'apppassword',
  database: process.env.DB_NAME || 'appdb',
  synchronize: true,
  logging: false,
  entities: [User],
});

module.exports = dataSource;