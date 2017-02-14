module.exports = function (app) {

  var ADMIN_USER_EMAIL = 'admin@test.test';

  var User = app.models.user;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;

  User.find({
    where: {
      email: ADMIN_USER_EMAIL
    }
  }, function (err, user) {
    if (err) {
      throw err;
    }

    if (user.length) {
      return
    }

    initProperties();
    createUser();
  });

  function initProperties() {
    var ObjectID = RoleMapping.getDataSource().connector.getDefaultIdType();
    RoleMapping.defineProperty('principalId', {
      type: ObjectID
    });

  }

  function createUser() {
    User.create([{
      firstname: 'Admin',
      lastname: 'Admin',
      email: ADMIN_USER_EMAIL,
      password: 'admin'
    }], function (err, users) {
      if (err) {
        throw err;
      }

      Role.create({
        name: 'admin'
      }, function (err, role) {
        if (err) {
          throw err;
        }

        console.log('Created role:', role);

        role.principals.create({
          principalType: RoleMapping.USER,
          principalId: users[0].id
        }, function (err, principal) {
          if (err) {
            throw err;
          }

          console.log('Created principal:', principal);
        });
      });
    });
  }
};
