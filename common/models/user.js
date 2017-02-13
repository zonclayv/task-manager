'use strict';

module.exports = function (User) {
  User.getRoles = function (id, cb) {
    var loopback = require('loopback');
    var Role = loopback.getModel('Role');
    var RoleMapping = loopback.getModel('RoleMapping');

    RoleMapping.find({
      filter: {
        where: {principalType: RoleMapping.USER, principalId: id}
      },
      include: ['role']
    }, function (err, mappings) {
      if (err) {
        cb(err, []);
        return;
      }

      var result = mappings.map(function (m) {
        var _m = m.toJSON();
        return _m.role.name;
      });

      cb(err, result);

    });
  };

  User.remoteMethod('getRoles', {
    accepts: [
      {arg: 'id', type: 'string'},
    ],
    returns: {arg: 'roles', type: 'string'},
    http: {
      verb: 'get',
      path: '/:id/roles'
    }
  });
};
