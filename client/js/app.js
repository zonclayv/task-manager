angular
  .module('app', [
    'ui.router',
    'lbServices',
    'angularFileUpload'
  ])
  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('add-task', {
        url: '/add-task',
        templateUrl: 'views/task-form.html',
        controller: 'AddTaskCtrl',
        authenticate: true
      })
      .state('home', {
        url: '/',
        templateUrl: 'views/home.html'
      })
      .state('add-task-group', {
        url: '/add-task-group',
        templateUrl: 'views/task-group-form.html',
        controller: 'AddTaskGroupCtrl',
        authenticate: true
      })
      .state('all-tasks', {
        url: '/all-tasks',
        templateUrl: 'views/all-tasks.html',
        controller: 'AllTasksCtrl',
        authenticate: true
      })
      .state('edit-task', {
        url: '/edit-task/:id/:userId',
        templateUrl: 'views/task-form.html',
        controller: 'EditTaskCtrl',
        authenticate: true
      })
      .state('delete-task', {
        url: '/delete-task/:id',
        controller: 'DeleteTaskCtrl',
        authenticate: true
      })
      .state('forbidden', {
        url: '/forbidden',
        templateUrl: 'views/forbidden.html',
      })
      .state('sign-in', {
        url: '/sign-in',
        templateUrl: 'views/sign-in-form.html',
        controller: 'AuthLoginCtrl'
      })
      .state('logout', {
        url: '/logout',
        controller: 'AuthLogoutCtrl'
      })
      .state('my-tasks', {
        url: '/my-tasks',
        templateUrl: 'views/my-tasks.html',
        controller: 'MyTasksCtrl',
        authenticate: true
      })
      .state('sign-up', {
        url: '/sign-up',
        templateUrl: 'views/sign-up-form.html',
        controller: 'SignUpCtrl',
      })
      .state('sign-up-success', {
        url: '/sign-up/success',
        templateUrl: 'views/sign-up-success.html'
      })
      .state('all-users', {
        url: '/all-users',
        templateUrl: 'views/all-users.html',
        controller: 'AllUsersCtrl',
        authenticate: true
      })
      .state('profile', {
        url: '/profile/:id',
        templateUrl: 'views/user-info.html',
        controller: 'ProfileCtrl',
        authenticate: true
      });

    $urlRouterProvider.otherwise('home');

  }])
  .run(['$rootScope', '$state', 'LoopBackAuth', 'AuthService',
        function ($rootScope, $state, LoopBackAuth, AuthService) {
          $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {

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
