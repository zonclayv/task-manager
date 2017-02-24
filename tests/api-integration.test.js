var app = require('../server/server');
var request = require('supertest');
var assert = require('assert');
var loopback = require('loopback');

function json(verb, url) {
  return request(app)[verb](url)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/);
}

describe('REST API request', function () {
  before(function (done) {
    require('./start-server');
    done();
  });

  after(function (done) {
    app.removeAllListeners('started');
    app.removeAllListeners('loaded');
    done();
  });

  it('should not allow access without access token', function (done) {
    json('get', '/api/TaskGroups')
      .expect(401, done);
  });

  it('should login non-admin and get the TaskGroups', function (done) {
    json('post', '/api/users/login')
      .send({
        email: 'user@test.com',
        password: '1'
      })
      .expect(200, function (err, res) {
        assert(typeof res.body === 'object', "not valid response body");
        assert(res.body.id, 'must have an access token');
        var accessToken = res.body.id;
        json('get', '/api/users/'+res.body.userId+'/groups?access_token=' + accessToken)
          .expect(200, function (err, res) {
            var taskGroups = res.body;
            assert(Array.isArray(taskGroups), "not valid response body");
            assert(taskGroups[0].title);
            done();
          });
      });
  });

  var accessToken;

  it('should login the admin user and get all TaskGroups', function (done) {
    json('post', '/api/users/login')
      .send({
        email: 'admin@test.test',
        password: 'admin'
      })
      .expect(200, function (err, res) {
        assert(typeof res.body === 'object');
        assert(res.body.id, 'must have an access token');
        accessToken = res.body.id;

        json('get', '/api/users/' + res.body.userId + '/roles?access_token=' + accessToken)
          .expect(200, function (err, res) {
            assert(Array.isArray(res.body), "not valid response body");;
            assert.equal(res.body.length, 1);
            assert.equal(res.body[0].name, "admin");
          });

        json('get', '/api/TaskGroups?access_token=' + accessToken)
          .expect(200, function (err, res) {
            var taskGroups = res.body;
            assert(Array.isArray(taskGroups), "not valid response body");
            assert.ok(taskGroups.length >= 2);
            done();
          });
      });
  });

  it('should change task group', function (done) {
    json('get', '/api/TaskGroups?access_token=' + accessToken)
      .expect(200, function (err, res) {
        var taskGroups = res.body;
        assert(Array.isArray(taskGroups), "not valid response body");
        assert.ok(taskGroups.length >= 2);

        var taskGroupFirst = taskGroups[0];
        var taskGroupSecond = taskGroups[1];

        assert(taskGroupFirst.id);
        assert(taskGroupSecond.id);

        json('get', '/api/Tasks?filter={"where":{"groupId":"' + taskGroupFirst.id + '"}}&access_token=' + accessToken)
          .expect(200, function (err, res) {
            assert(Array.isArray(res.body), "not valid response body");
            var task = res.body[0];
            assert(task.id);

            json('patch', '/api/Tasks?&id=' + task.id + '&access_token=' + accessToken)
              .send({
                title: taskGroupSecond.title,
                description: taskGroupSecond.description,
                status: taskGroupSecond.status,
                groupId: taskGroupSecond.id
              })
              .expect(200, function (err, res) {
                assert(typeof res.body === 'object');
                assert(res.body.groupId);
                assert.equal(res.body.groupId, taskGroupSecond.id);
                done();
              });
          });
      });
  });

  it('should mark task as completed', function (done) {
    json('get', '/api/Tasks?filter={"where":{"status":0}}&access_token=' + accessToken)
      .expect(200, function (err, res) {
        assert(Array.isArray(res.body), "not valid response body");
        assert.ok(res.body.length > 0, "tasks not found");

        var task = res.body[0];
        assert(task.id);

        json('patch', '/api/Tasks?&id=' + task.id + '&access_token=' + accessToken)
          .send({
            title: task.title,
            description: task.description,
            status: 1,
            groupId: task.id
          })
          .expect(200, function (err, res) {
            assert(typeof res.body === 'object');
            assert(res.body.status);
            assert.equal(res.body.status, 1);
            done();
          });
      });
  });

  it('should mark all tasks in group as completed', function (done) {
    json('get', '/api/Tasks?filter={"where":{"status":0}}&access_token=' + accessToken)
      .expect(200, function (err, res) {
        assert(Array.isArray(res.body), "not valid response body");
        assert.ok(res.body.length > 0, "tasks not found");

        var task = res.body[0];
        assert(task.id);
        assert(task.groupId);

        json('post', '/api/Tasks/update?where={"groupId":"' + task.groupId + '"}&access_token=' + accessToken)
          .send({
            status: 1
          })
          .expect(200, function (err, res) {
            assert(typeof res.body === 'object');
            console.log(res.body);
            assert(res.body.count);
            assert.ok(res.body.count > 0);
            done();
          });
      });
  });
});

describe('Unexpected Usage', function () {
  it('should not crash the server when posting a bad id', function (done) {
    json('post', '/api/users/badId')
      .send({})
      .expect(404, done);
  });
});
