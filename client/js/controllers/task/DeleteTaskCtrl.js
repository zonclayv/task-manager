angular
  .module('app')
  .controller('DeleteTaskCtrl',
    ['$scope', 'Task', '$state', '$stateParams', function ($scope, Task, $state, $stateParams) {
      Task
        .deleteById({id: $stateParams.id})
        .$promise
        .then(function () {
          $state.go('my-tasks');
        });
    }]);
