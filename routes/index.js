const users = require('./users');

module.exports = (router)=>{ // To keep the index route clean, we send them to users route
  users(router);
  return router;
};
