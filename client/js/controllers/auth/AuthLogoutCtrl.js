angular
  .module('app')
  .controller('AuthLogoutCtrl',
    ['$scope', 'AuthService', '$state', function ($scope, AuthService, $state) {
      AuthService
        .logout()
        .then(function () {
          $state.go('home');
        });
    }]);
