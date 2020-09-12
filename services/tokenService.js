const settingsProvider = require("../utils/settingsProvider");
const jwt = require('jsonwebtoken');

module.exports = {
    generateToken: (username)=> {
        const payload = { user: username };
        const secret = settingsProvider.jwt_secret;
        const options = { expiresIn: '1h', issuer: 'http://localhost:3000' };
        const token = jwt.sign(payload, secret, options);
        return new Promise((resolve, reject)=> {
            resolve(token);
        });
    }
}