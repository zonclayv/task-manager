angular
  .module('app')
  .controller('EditTaskCtrl',
    ['$scope', '$q', 'TaskGroup', 'Task', '$stateParams', '$state',
      function ($scope, $q, TaskGroup, Task, $stateParams, $state) {
        $scope.action = 'Edit';
        $scope.taskGroups = [];
        $scope.task = {};

        $q
          .all([
            TaskGroup.find({
              filter: {
                where: {
                  userId: $stateParams.userId
                }
              }
            }).$promise,
            Task.findById({id: $stateParams.id}).$promise
          ])
          .then(function (data) {
            $scope.task = data[1];
            var taskGroups = $scope.taskGroups = data[0];

            var selectedTaskGroupIndex = taskGroups
              .map(function (taskGroup) {
                return taskGroup.id;
              })
              .indexOf($scope.task.groupId);
            $scope.selectedGroup =
              taskGroups[selectedTaskGroupIndex];
          });

        $scope.submitForm = function () {
          $scope.task.groupId = $scope.selectedGroup.id;
          $scope.task
            .$save()
            .then(function () {
              $state.go('my-tasks');
            });
        };
      }]);
