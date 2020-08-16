const connectionProvider = require("../utils/connectionProvider");
const settingsProvider = require("../utils/settingsProvider");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var logger = require('../utils/logger').logger;
const saltRounds = 10;

module.exports = {
    // Check wether user exists in our db, if not exists do next call
    // if user already exists in our db, send response 409.
    checkUserDuplicated:(req, res, next) => {
        let result = {};
        let status = 200;
        const username = req.body.username;
        let pool = connectionProvider.mySqlConnectionProvider.getTestDBConnection();
        let queryText = `SELECT count('x') AS count FROM user WHERE username = ? `;
        pool.getConnection(function (err, connection) {
            if (err) {
                // log the error
                logger.error(err);
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
            connection.query(queryText, [username], (err, rows) => {
                connectionProvider.mySqlConnectionProvider.closeConnection(connection);
                if (err) {
                    // log the error
                    logger.error(err);
                    status = 500;
                    result.status = status;
                    result.error = err;
                    res.status(status).send(result);
                }
                if (rows.length && rows[0].count) {
                    status = 409;
                    result.status = status;
                    result.error = 'User name already exists.';
                    res.status(status).send(result);
                } else {
                    next();
                }
            });
        });
    },

    // add new user to our db
    register: (req, res) => {
        let result = {};
        let status = 201;
        const {username, firstname, lastname, email, password} = req.body;
        bcrypt.hash(password, saltRounds, function (err, hash) {
            if (err) {
                logger.error(err);
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
            let pool = connectionProvider.mySqlConnectionProvider.getTestDBConnection();
            let queryText = `INSERT INTO user (id, username, password, firstname, lastname, email, createddate) 
                                VALUES (uuid(), ?, ?, ?, ?, ?, NOW()) `;
            pool.getConnection(function (err, connection) {
                if (err) {
                    // log the error
                    logger.error(err);
                    status = 500;
                    result.status = status;
                    result.error = err;
                    res.status(status).send(result);
                }
                if (connection) {
                    connection.query(queryText, [username, hash, firstname, lastname, email], (err, rows) => {
                        connectionProvider.mySqlConnectionProvider.closeConnection(connection);
                        if (err) {
                            // log the error
                            logger.error(err);
                            status = 500;
                            result.status = status;
                            result.error = err;
                        } else {
                            result.status = status;
                            result.message = "A verification mail has been sent to your registered mail.";
                        }
                        res.status(status).send(result);
                    });
                }
            });
        });
    },

    // Match the supplied username, password with our db entries
    // send user object on successfull match, if not send appropriate error
    login: (req, res) => {
        let result = {};
        let status = 200;
        const username = req.body.username;
        const password = req.body.password;
        let pool = connectionProvider.mySqlConnectionProvider.getTestDBConnection();
        let queryText = `SELECT id, username, password, email, firstname, lastname FROM user WHERE username = ?`;
        pool.getConnection(function (err, connection) {
            if (err) {
                // log the error
                logger.error(err);
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
            if (connection) {
                connection.query(queryText, [username], (err, rows) => {
                    connectionProvider.mySqlConnectionProvider.closeConnection(connection);
                    if (err) {
                        // log the error
                        logger.error(err);
                        status = 500;
                        result.status = status;
                        result.error = err;
                        res.status(status).send(result);
                    }
                    if (rows.length) {
                        let user = rows[0];
                        bcrypt.compare(password, user.password).then(match=>{
                            if (match) {
                                // Create a token
                                const payload = { user: user.username };
                                const secret = settingsProvider.jwt_secret;
                                const options = { expiresIn: '1h', issuer: 'http://localhost:3000' };
                                const token = jwt.sign(payload, secret, options);

                                delete user['password'];
                                // result.status = status;
                                // result.data = { token: token, user: user};
                                result = { token: token, user: user};
                            } else {
                                status = 401;
                                result.status = status;
                                result.error = `Authentication error`;
                            }
                            res.status(status).send(result);
                        }).catch(err=> {
                            logger.error(err);
                            status = 500;
                            result.status = status;
                            result.error = err;
                            res.status(status).send(result);
                        });
                    } else {
                        status = 404;
                        result.status = status;
                        result.error = 'User does not exists.';
                        res.status(status).send(result);
                    }
                });
            }
        });
    }
}