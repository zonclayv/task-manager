angular
  .module('app')
  .controller('DeleteTaskController',
  ['$scope', 'Task', '$state', '$stateParams', function ($scope, Task, $state, $stateParams) {
    Task
      .deleteById({id: $stateParams.id})
      .$promise
      .then(function () {
              $state.go('my-tasks');
            });
  }]);
