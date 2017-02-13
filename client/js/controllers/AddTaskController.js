angular
  .module('app')
  .controller('AddTaskController',
  ['AuthService', '$scope', 'TaskGroup', 'Task', '$state',
   function (AuthService, $scope, TaskGroup, Task, $state) {
     $scope.action = 'Add';
     $scope.taskGroups = [];
     $scope.task = {};
     $scope.isDisabled = false;

     TaskGroup
       .find({
         where: {
           userId: AuthService.getCurrentUser().id
         }
       })
       .$promise
       .then(function (taskGroups) {
               $scope.taskGroups = taskGroups;
               $scope.selectedGroup =
                 $scope.selectedGroup || taskGroups[0];
             });

     $scope.submitForm = function () {
       Task
         .create({
           title: $scope.task.title,
           description: $scope.task.description,
           groupId: $scope.selectedGroup.id
         })
         .$promise
         .then(function () {
                 $state.go('my-tasks');
               });
     };
   }]);
