const Sequelize = require('sequelize');
const config = require('../../config')
sequelize = new Sequelize(config.DB_NAME, config.DB_USERNAME, config.DB_PASSWORD, {
    host: config.DB_HOST_ADDRESS,
    dialect: 'postgres'
});

module.exports = sequelize;