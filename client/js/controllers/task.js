angular
  .module('app')
  .controller('TasksController', ['$scope', 'TaskGroup', 'Task',
     function ($scope, TaskGroup, Task) {

       var getTaskGroup = function () {
       };

       $scope.getTasks = function (group) {
         $scope.currentGroup = group;
         $scope.tasks = Task.find({
           where: {
             groupId: group.id
           },
           order: 'status DESC'
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
     }])

  .controller('AllTasksController', ['$scope', 'TaskGroup', '$controller',
    function ($scope, TaskGroup, $controller) {

      angular.extend(this, $controller('TasksController', {$scope: $scope}));

      var getTaskGroup = function () {
        $scope.taskGroups = TaskGroup.find({
            include: [
              'user'
            ]
        });
      };

      getTaskGroup();

    }])
  .controller('MyTasksController', ['AuthService', '$scope', 'TaskGroup', '$controller',
    function (AuthService, $scope, TaskGroup, $controller) {

      angular.extend(this, $controller('TasksController', {$scope: $scope}));

      var getTaskGroup = function () {
       TaskGroup.find({
          where: {
            userId: AuthService.getCurrentUser().id
          },
          include: ['user']
        });
      };

      getTaskGroup();

    }])
  .controller('AddTaskController', ['AuthService', '$scope', 'TaskGroup', 'Task','$state',
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
          $scope.selectedGroup = $scope.selectedGroup || taskGroups[0];
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
    }])
  .controller('DeleteTaskController', ['$scope', 'Task', '$state',
    '$stateParams', function ($scope, Task, $state, $stateParams) {
      Task
        .deleteById({id: $stateParams.id})
        .$promise
        .then(function () {
          $state.go('my-tasks');
        });
    }])
  .controller('EditTaskController', ['$scope', '$q', 'TaskGroup', 'Task',
  '$stateParams', '$state', function ($scope, $q, TaskGroup, Task,
                                      $stateParams, $state) {
    $scope.action = 'Edit';
    $scope.taskGroups = [];
    $scope.task = {};

    $q
      .all([
        TaskGroup.find({
            where: {
              userId: $stateParams.userId
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
        $scope.selectedGroup = taskGroups[selectedTaskGroupIndex];
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
