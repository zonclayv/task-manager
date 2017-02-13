angular
  .module('app')
  .controller('AddTaskGroupController',
  ['$rootScope', '$scope', 'TaskGroup', '$state', function ($rootScope, $scope, TaskGroup, $state) {

    $scope.action = 'Add';
    $scope.taskGroup = {};
    $scope.isDisabled = false;

    $scope.submitForm = function () {
      TaskGroup
        .create({
          title: $scope.taskGroup.title,
          userId: $rootScope.currentUser.id
        })
        .$promise
        .then(function () {
          $state.go('my-tasks');
        });
    };
  }]);
