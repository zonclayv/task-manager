angular
  .module('app')
  .controller('AddTaskGroupCtrl',
    ['AuthService', '$scope', 'User', '$state',
      function (AuthService, $scope, User, $state) {

        $scope.action = 'Add';
        $scope.taskGroup = {};
        $scope.isDisabled = false;

        $scope.submitForm = function () {
          User.groups.create({"id": AuthService.getCurrentUser().id}, {
            title: $scope.taskGroup.title,
            ownerId: AuthService.getCurrentUser().id
          })
            .$promise
            .then(function () {
              $state.go('my-tasks');
            });
        };
      }]);
