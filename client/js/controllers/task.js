angular
  .module('app')
  .controller('AllTasksController', ['$rootScope', '$scope', 'TaskGroup', 'Task',
    '$state', function ($rootScope, $scope, TaskGroup, Task, $state) {

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

      $scope.complete = function (task) {
        Task.updateAll(
          {where: {id: task.id}},
          {status: 1},
          function (err, results) {
            $scope.getTasks($scope.currentGroup);
          });
      };

      $scope.markAsCompleted = function (group) {
        Task.updateAll(
          {where: {groupId: group.id}},
          {status: 1},
          function (err, results) {
            getTaskGroup();
            $scope.getTasks($scope.currentGroup);
          });
      };
    }])
  .controller('AddTaskController', ['$rootScope', '$scope', 'TaskGroup', 'Task',
    '$state', function ($rootScope, $scope, TaskGroup, Task, $state) {
      $scope.action = 'Add';
      $scope.taskGroups = [];
      $scope.selectedGroup;
      $scope.task = {};
      $scope.isDisabled = false;

      TaskGroup
        .find({
          filter: {
            where: {
              userId: $rootScope.currentUser.id
            }
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
  .controller('AddTaskGroupController', ['$rootScope', '$scope', 'TaskGroup',
    '$state', function ($rootScope, $scope, TaskGroup, $state) {
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
  .controller('EditTaskController', ['$rootScope', '$scope', '$q', 'TaskGroup', 'Task',
  '$stateParams', '$state', function ($rootScope, $scope, $q, TaskGroup, Task,
                                      $stateParams, $state) {
    $scope.action = 'Edit';
    $scope.taskGroups = [];
    $scope.selectedGroup;
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
        $scope.selectedGroup;

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
        .then(function (task) {
          $state.go('my-tasks');
        });
    };
  }])
  .controller('MyTasksController', ['$rootScope', '$scope', 'TaskGroup', 'Task',
    '$state', function ($rootScope, $scope, TaskGroup, Task, $state) {

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

      var getTaskGroup = function () {
        $scope.taskGroups = TaskGroup.find({
          filter: {
            where: {
              userId: $rootScope.currentUser.id
            },
            include: [
              'user'
            ]
          }
        });
      };

      getTaskGroup();

      $scope.complete = function (task) {
        Task.updateAll(
          {where: {id: task.id}},
          {status: 1},
          function (err, results) {
            $scope.getTasks($scope.currentGroup);
          });
      };

      $scope.markAsCompleted = function (group) {
        Task.updateAll(
          {where: {groupId: group.id}},
          {status: 1},
          function (err, results) {
            getTaskGroup();
            $scope.getTasks($scope.currentGroup);
          });
      };
    }]);
