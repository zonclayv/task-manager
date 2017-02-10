'use strict';

var CONTAINERS_URL = '/api/containers/';

module.exports = function (User) {
  User.getRoles = function (id, cb) {
    var loopback = require('loopback');
    var Role = loopback.getModel('Role');
    var RoleMapping = loopback.getModel('RoleMapping');

    RoleMapping.find({
      where: {principalType: RoleMapping.USER, principalId: id},
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

  User.uploadImg = function (user, ctx, options, cb) {

    if (!options) options = {};

    ctx.req.params.container = 'common';

    var loopback = require('loopback');
    var Container = loopback.getModel('Container');
    Container.upload(ctx.req, ctx.result, options, function (err, fileObj) {
      if (err) {
        cb(err);
      } else {
        var fileInfo = fileObj.files.file[0];
        User
          .findById({id: user}, function (err, obj) {
            if (err !== null) {
              cb(err);
              return;
            }

            User.updateAll({where: {id: obj.id}}, {
                picture: CONTAINERS_URL + fileInfo.container + '/img/' + fileInfo.name
              },
              function (err, results) {
                if (err !== null) {
                  cb(err);
                } else {
                  cb(null, CONTAINERS_URL + fileInfo.container + '/img/' + fileInfo.name);
                }
              });
          });
      }
    });
  };

  User.remoteMethod('uploadImg', {
      description: 'Uploads a file',
      accepts: [
        {arg: 'user', type: 'string'},
        {arg: 'ctx', type: 'object', http: {source: 'context'}},
        {arg: 'options', type: 'object', http: {source: 'query'}}
      ],
      returns: {
        arg: 'url', type: 'string', root: true
      },
      http: {verb: 'post'}
    }
  );
};
