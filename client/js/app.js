angular
  .module('app', [
    'ui.router',
    'lbServices'
  ])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider,
      $urlRouterProvider) {
    $stateProvider
      .state('add-task', {
        url: '/add-task',
        templateUrl: 'views/task-form.html',
        controller: 'AddTaskController',
        authenticate: true
      })
      .state('add-task-group', {
        url: '/add-task-group',
        templateUrl: 'views/task-group-form.html',
        controller: 'AddTaskGroupController',
        authenticate: true
      })
      .state('all-tasks', {
        url: '/all-tasks',
        templateUrl: 'views/all-tasks.html',
        controller: 'AllTasksController',
        authenticate: true
      })
      .state('edit-task', {
        url: '/edit-task/:id/:userId',
        templateUrl: 'views/task-form.html',
        controller: 'EditTaskController',
        authenticate: true
      })
      .state('delete-task', {
        url: '/delete-task/:id',
        controller: 'DeleteTaskController',
        authenticate: true
      })
      .state('forbidden', {
        url: '/forbidden',
        templateUrl: 'views/forbidden.html',
      })
      .state('sign-in', {
        url: '/sign-in',
        templateUrl: 'views/sign-in-form.html',
        controller: 'AuthLoginController'
      })
      .state('logout', {
        url: '/logout',
        controller: 'AuthLogoutController'
      })
      .state('my-tasks', {
        url: '/my-tasks',
        templateUrl: 'views/my-tasks.html',
        controller: 'MyTasksController',
        authenticate: true
      })
      .state('sign-up', {
        url: '/sign-up',
        templateUrl: 'views/sign-up-form.html',
        controller: 'SignUpController',
      })
      .state('sign-up-success', {
        url: '/sign-up/success',
        templateUrl: 'views/sign-up-success.html'
      })
      .state('all-users', {
        url: '/all-users',
        templateUrl: 'views/all-users.html',
        controller: 'AllUsersController',
        authenticate: true
      })
      .state('profile', {
        url: '/profile/:id',
        templateUrl: 'views/user-info.html',
        controller: 'ProfileController',
        authenticate: true
      });
    $urlRouterProvider.otherwise('my-tasks');
  }])
  .run(['$rootScope', '$state', 'LoopBackAuth', 'AuthService', function($rootScope, $state, LoopBackAuth, AuthService) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {

      if (toState.authenticate && !LoopBackAuth.accessTokenId) {
        event.preventDefault();

        $rootScope.returnTo = {
          state: toState,
          params: toParams
        };

        $state.go('forbidden');
      }
    });

    if (LoopBackAuth.accessTokenId && !$rootScope.currentUser) {
      AuthService.refresh(LoopBackAuth.accessTokenId);
    }
  }]);
