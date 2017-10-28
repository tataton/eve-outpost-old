/* Going to switch to Postgres.

const mongoose = require('mongoose');

// Schema sources info from user's EVE Online account
const userSchema = mongoose.Schema({
    charID: Number,
    charName: String,
    refreshToken: String,
    googleName: String,
});

module.exports = mongoose.model('User', userSchema);

*/

module.exports = {};