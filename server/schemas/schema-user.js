const Sequelize = require('sequelize');

const userSchema = {
    characterID: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    accessToken: {
        type: Sequelize.STRING,
        allowNull: false,
    }
};

module.exports = userSchema;