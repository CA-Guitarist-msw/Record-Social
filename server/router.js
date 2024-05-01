const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getRecords', mid.requiresLogin, controllers.Record.getRecords);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.post('/changePassword', mid.requiresLogin, controllers.Account.changePassword);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/recorder', mid.requiresLogin, controllers.Record.recorderPage);
  app.post('/recorder', mid.requiresLogin, controllers.Record.createRecord);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

  app.all('*', (req, res) => {
    res.render('pageNotFound');
  });
};

module.exports = router;
