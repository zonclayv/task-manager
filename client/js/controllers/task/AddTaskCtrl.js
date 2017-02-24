angular
  .module('app')
  .controller('AddTaskCtrl',
    ['AuthService', '$scope', 'TaskGroup', 'User', '$state',
      function (AuthService, $scope, TaskGroup, User, $state) {
        $scope.action = 'Add';
        $scope.taskGroups = [];
        $scope.task = {};
        $scope.isDisabled = false;


        User.groups({
          'id': AuthService.getCurrentUser().id, 'filter': {
            include: ['tasks']
          }
        }).$promise
          .then(function (groups) {
            $scope.taskGroups = groups;
            $scope.selectedGroup = $scope.selectedGroup || groups[0];
          });

        $scope.submitForm = function () {
          TaskGroup.tasks.create({'id': $scope.selectedGroup.id}, {
            title: $scope.task.title,
            description: $scope.task.description,
            groupId: $scope.selectedGroup.id,
            ownerId: AuthService.getCurrentUser().id
          })
            .$promise
            .then(function () {
              $state.go('my-tasks');
            });
        };
      }]);
