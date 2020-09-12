const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    generateHash: (password) => {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, saltRounds)
            .then((hash)=> {
                resolve(hash);
            }).catch((err)=> {
                reject(err);
            });
        });
    },

    matchPassword: (password, hash) => {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, hash)
            .then(match => {
                resolve(match);
            }).catch(err => {
                reject(err);
            });
        });
    }
}