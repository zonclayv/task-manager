angular
  .module('app')
  .controller('AuthLoginController', ['$scope', 'AuthService', '$state',
    function ($scope, AuthService, $state) {
      $scope.user = {};

      $scope.login = function () {
        AuthService.login($scope.user.email, $scope.user.password)
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
    }])
  .controller('AuthLogoutController', ['$scope', 'AuthService', '$state',
    function ($scope, AuthService, $state) {
      AuthService.logout()
        .then(function () {
          $state.go('home');
        });
    }])
  .controller('SignUpController', ['$scope', 'AuthService', '$state',
    function ($scope, AuthService, $state) {
      $scope.user = {};

      $scope.register = function () {
        AuthService.register($scope.user.email, $scope.user.password)
          .then(function () {
            $state.transitionTo('sign-up-success');
          });
      };
    }])
  .controller('AllUsersController', ['$scope', 'User',
    function ($scope, User) {

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

      $scope.getAvatar = function(user){
        return '/api/containers/' + user.id + '/download/' + user.picture;
      }

    }])
  .controller('ProfileController', ['$stateParams', '$scope', 'User', '$state', 'FileUploader', 'Container',
    function ($stateParams, $scope, User, $state, FileUploader, Container) {

      function getUser() {
        User
          .findById({id: $stateParams.id})
          .$promise
          .then(function (result) {
            $scope.selectedUser = result;
            uploader.url = '/api/containers/' + result.id + '/upload';
            if (result.picture) {
              $scope.userImg = '/api/containers/' + result.id + '/download/' + result.picture;
            }
          });
      }

      function saveUser(userId, props) {
        User.updateAll(
          {where: {id: userId}},
          props,
          function () {
            getUser();
          });
      }

      getUser();

      var newImageItem;

      var uploader = $scope.uploader = new FileUploader({
        scope: $scope,
        url: '',
        formData: [
          {key: 'value'}
        ]
      });

      uploader.filters.push({
        name: 'filterName',
        fn: function () {
          return true;
        }
      });

      uploader.onAfterAddingFile = function (item) {
        newImageItem = item;
      };

      uploader.onSuccessItem = function (item, response) {
        newImageItem = null;

        if (response.result[0]._id) {

          var user = $scope.selectedUser;

          if (user.picture) {
            Container.removeFile({container: user.id, file: user.picture});
          }

          saveUser(user.id, {
            picture: response.result[0].filename
          });
        }
      };

      $scope.saveUser = function () {

        if (newImageItem) {
          newImageItem.upload();
        }

        var user = $scope.selectedUser;

        saveUser(user.id, {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email
        });
      };

      $scope.cancel = function () {
        $state.go('home');
      };

    }]);

