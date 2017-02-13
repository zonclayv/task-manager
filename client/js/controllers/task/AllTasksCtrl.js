angular
  .module('app')
  .controller('AllTasksCtrl',
  ['$scope', 'TaskGroup', 'Task', function ($scope, TaskGroup, Task) {

    var getTaskGroup = function () {
      $scope.taskGroups = TaskGroup.find({
        filter: {
          include: [
            'user'
          ]
        }
      });
    };

    getTaskGroup();

    $scope.getTasks = function (group) {
      $scope.currentGroup = group;
      $scope.tasks = Task.find({
        filter: {
          where: {
            groupId: group.id
          },
          order: 'status DESC'
        }
      });
    };

    $scope.complete = function (task) {
      Task.updateAll(
        {where: {id: task.id}},
        {status: 1},
        function () {
          $scope.getTasks($scope.currentGroup);
        });
    };

    $scope.markAsCompleted = function (group) {
      Task.updateAll(
        {where: {groupId: group.id}},
        {status: 1},
        function () {
          getTaskGroup();
          $scope.getTasks($scope.currentGroup);
        });
    };
  }]);