const connectionProvider = require("../utils/connectionProvider");

module.exports = {
    checkUserDuplicated: (username) => {
        let pool = connectionProvider.mySqlConnectionProvider.getTestDBConnection();
        let queryText = `SELECT count('x') AS count FROM user WHERE username = ? `;
        return new Promise((resolve, reject) => {
            pool.getConnection(function (err, connection) {
                if (err) return reject(err);

                connection.query(queryText, [username], (err, rows) => {
                    connectionProvider.mySqlConnectionProvider.closeConnection(connection);
                    if (err) return reject(err);
                    return resolve(rows);
                });
            });
        });
    },

    createNewUser: (userObj) => {
        const { username, firstname, lastname, email, hash } = userObj;
        let pool = connectionProvider.mySqlConnectionProvider.getTestDBConnection();
        let queryText = `INSERT INTO user (id, username, password, firstname, lastname, email, createddate) 
                            VALUES (uuid(), ?, ?, ?, ?, ?, NOW()) `;

        return new Promise((resolve, reject) => {
            pool.getConnection(function (err, connection) {
                if (err) return reject(err);

                if (connection) {
                    connection.query(queryText, [username, hash, firstname, lastname, email], (err, rows) => {
                        connectionProvider.mySqlConnectionProvider.closeConnection(connection);
                        if (err) return reject(err);
                        return resolve(rows);
                    });
                }
            });
        });
    },

    getUserInfo: (username) => {
        let pool = connectionProvider.mySqlConnectionProvider.getTestDBConnection();
        let queryText = `SELECT id, username, password, email, firstname, lastname FROM user WHERE username = ?`;

        return new Promise((resolve, reject) => {
            pool.getConnection(function (err, connection) {
                if (err) return reject(err);
                
                if (connection) {
                    connection.query(queryText, [username], (err, rows) => {
                        connectionProvider.mySqlConnectionProvider.closeConnection(connection);
                        if (err) return reject(err);
                        return resolve(rows);
                    });
                }
            });
        });
    }
}