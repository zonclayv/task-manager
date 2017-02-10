angular
  .module('app')
  .factory('AuthService', ['User', '$q', '$rootScope', '$state', function (User, $q, $rootScope, $state) {

    function login(email, password) {
      return User
        .login({email: email, password: password})
        .$promise
        .then(function (response) {

          $rootScope.currentUser = {
            id: response.user.id,
            tokenId: response.id,
            email: email
          };

          User.getRoles({id: $rootScope.currentUser.id}, function (response) {
            $rootScope.currentUser.hasAdminAuthority = (response.roles.indexOf('admin') !== -1);
          });

        });
    }

    function logout() {
      return User
        .logout()
        .$promise
        .then(function () {
          $rootScope.currentUser = null;
        });
    }

    function register(email, password) {
      return User
        .create({
          email: email,
          password: password
        })
        .$promise;
    }

    function refresh(accessTokenId) {
      return User
        .getCurrent(function (userResource) {
          $rootScope.currentUser = {
            id: userResource.id,
            tokenId: accessTokenId,
            email: userResource.email
          };

          User.getRoles({id: $rootScope.currentUser.id}, function (response) {
            $rootScope.currentUser.hasAdminAuthority = (response.roles.indexOf('admin') !== -1);
          });
        });
    }

    return {
      login: login,
      logout: logout,
      register: register,
      refresh: refresh
    };
  }]);
