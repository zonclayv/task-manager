angular
  .module('app')
  .controller('AllTasksCtrl',
    ['$scope', 'TaskGroup', 'Task', function ($scope, TaskGroup, Task) {

      var getTaskGroup = function () {
        $scope.taskGroups = TaskGroup.find({
          filter: {
            include: ['owner', 'tasks']
          }
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
