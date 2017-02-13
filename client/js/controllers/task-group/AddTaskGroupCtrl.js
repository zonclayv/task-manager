angular
  .module('app')
  .controller('AddTaskGroupCtrl',
  ['AuthService', '$scope', 'TaskGroup', '$state',
   function (AuthService, $scope, TaskGroup, $state) {

     $scope.action = 'Add';
     $scope.taskGroup = {};
     $scope.isDisabled = false;

     $scope.submitForm = function () {
       TaskGroup
         .create({
           title: $scope.taskGroup.title,
           userId: AuthService.getCurrentUser().id
         })
         .$promise
         .then(function () {
                 $state.go('my-tasks');
               });
     };
   }]);
