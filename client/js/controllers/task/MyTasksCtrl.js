angular
  .module('app')
  .controller('MyTasksCtrl',
    ['AuthService', '$scope', 'TaskGroup', 'Task', 'User', function (AuthService, $scope, TaskGroup, Task, User) {

      var getTaskGroup = function () {
        User.groups({
          "id": AuthService.getCurrentUser().id,
          "filter": {
            include: ["tasks"]
          }
        }).$promise
          .then(function (groups) {
            $scope.taskGroups = groups;
          });
      };

      getTaskGroup();

      $scope.getTasks = function (group) {
        $scope.tasks = group.tasks;
      };

      $scope.complete = function (task) {
        Task.updateAll(
          {where: {id: task.id}},
          {status: 1},
          function () {
            $scope.tasks = [];
          });
      };

      $scope.markAsCompleted = function (group) {
        Task.updateAll(
          {where: {groupId: group.id}},
          {status: 1},
          function () {
            getTaskGroup();
            $scope.tasks = [];
          });
      };
    }]);
