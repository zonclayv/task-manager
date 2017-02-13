angular
  .module('app')
  .controller('AuthLoginCtrl',
  ['$scope', 'AuthService', '$state', function ($scope, AuthService, $state) {
    $scope.user = {};

    $scope.login = function () {
      AuthService
        .login($scope.user.email, $scope.user.password)
        .then(function () {

          if ($scope.returnTo && $scope.returnTo.state) {
            $state.go(
              $scope.returnTo.state.name,
              $scope.returnTo.params
            );

            $scope.returnTo.state = null;
            $scope.returnTo.params = null;
            return;
          }

          $state.go('home');
        });
    };
  }]);

