angular
  .module('app')
  .controller('SignUpCtrl',
  ['$scope', 'AuthService', '$state', function ($scope, AuthService, $state) {
    $scope.user = {};

    $scope.register = function () {
      AuthService
        .register($scope.user.email, $scope.user.password)
        .then(function () {
                $state.transitionTo('sign-up-success');
              });
    };
  }]);
