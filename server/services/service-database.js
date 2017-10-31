/* Contains all database models. All models go through this
one file so that all database methods only need to go through
one sequelize instance ("db"). */

const db = require('../modules/module-sequelize');
const userSchema = require('../schemas/schema-user');
const User = db.define('user', userSchema);

module.exports.User = User;