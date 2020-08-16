const config = require('config.json')(); // Alternatively we can pull user environment variables here
const env = process.env.NODE_ENV || 'development';

module.exports = {
    mySqlConnections: config[env].mySqlConnections,
    jwt_secret: config[env].jwt_secret
}