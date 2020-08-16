const controller = require('../controllers/users');

// Handles all the routes that match '/user/..'
module.exports = (router) => {
  // while registering a new user, first check whether the user alraedy exists in our db
  router.route('/register')
  .post(controller.checkUserDuplicated, controller.register);
  
  router.route('/login')
  .post(controller.login);
};
