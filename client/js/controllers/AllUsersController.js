angular
  .module('app')
  .controller('AllUsersController', ['$scope', 'User', function ($scope, User) {

    function getUsers() {
      User
        .find()
        .$promise
        .then(function (results) {
                $scope.users = results;
              });
    }

    getUsers();

    $scope.removeUser = function (user) {
      User
        .deleteById(user)
        .$promise
        .then(function () {
                getUsers();
              });
    };

    $scope.getAvatar = function (user) {
      return '/api/containers/' + user.id + '/download/'
             + user.picture;
    }

  }]);
