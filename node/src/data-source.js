require('reflect-metadata');
require('dotenv').config();
const { DataSource } = require('typeorm');

const isProduction = process.env.NODE_ENV === "production";

const dataSource = new DataSource({
    type: isProduction ? "oracle" : "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || (isProduction ? "1521" : "5432")),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: isProduction ? undefined : process.env.DB_NAME,
    sid: isProduction ? process.env.DB_SERVICE : undefined,
    synchronize: !isProduction,
    logging: true,
    entities: [require('./entities/User')],
});

module.exports = dataSource;