module.exports = function (app) {
  var User = app.models.user;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;

  User.create([{
    firstname: 'Admin',
    lastname: 'Admin',
    email: 'admin@test.test',
    password: 'admin'
  }], function (err, users) {
    if (err) {
      throw err;
    }

    console.log('Created users:', users);

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
};
