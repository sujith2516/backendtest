var logger = require('../utils/logger').logger;
const loginService = require('../services/loginService');
const bcryptService = require('../services/bcryptService');
const tokenService = require('../services/tokenService');

module.exports = {
    // Check wether user exists in our db, if not exists do next call
    // if user already exists in our db, send response 409.
    checkUserDuplicated: async (req, res, next) => {
        const username = req.body.username;
        try {
            const userInfo = await loginService.checkUserDuplicated(username);
            if (userInfo.length && userInfo[0].count) {
                res.status(409).send({error: 'User name already exists.'});
            } else {
                next();
            }
        } catch (err) {
            if (err) logger.error(err);
            res.status(500).send({error: `Internal server error`});
        }
    },

    // add new user to our db
    register: async (req, res) => {
        const userObj = {
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email
        }
        try {
            const hash = await bcryptService.generateHash(req.body.password);
            userObj.hash = hash;
            await loginService.createNewUser(userObj);
            res.status(201).send({message: `A verification mail has been sent to your registered mail.`});
        } catch (err) {
            if (err) logger.error(err);
            res.status(500).send({error: `Internal server error`});
        }
    },

    // Match the supplied username, password with our db entries
    // send user object on successfull match, if not send appropriate error
    login: async (req, res) => {
        let result = {};
        const username = req.body.username;
        const password = req.body.password;
        try {
            var userInfo = await loginService.getUserInfo(username);
            if (userInfo.length) {
                userInfo = userInfo[0];
                // match the password in our db
                var mached = await bcryptService.matchPassword(password, userInfo.password);
                if (mached) {
                    // password matched in our db, generate token
                    tokenService.generateToken(username)
                        .then((token) => {
                            delete userInfo['password'];
                            result = { token: token, user: userInfo };
                            res.status(200).send(result);
                        }).catch((err) => {
                            if (err) logger.error(err);
                            res.status(500).send({error: `Token not generated`});
                        });
                } else {
                    res.status(401).send({error: `Authentication error`});
                }
            } else {
                res.status(404).send({error: `User does not exists.`});
            }
        } catch (err) {
            if (err) logger.error(err);
            res.status(500).send({error: `Internal server error`});
        }
    }
}