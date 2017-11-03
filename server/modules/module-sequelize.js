const Sequelize = require('sequelize');
const config = require('../../config');
const sequelize = new Sequelize({
    database: config.DB_NAME,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    host: config.DB_HOST,
    port: config.DB_PORT,
    dialect: 'postgres',
    operatorsAliases: false
});

module.exports = sequelize;