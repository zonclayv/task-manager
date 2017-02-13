angular
  .module('app')
  .factory('AuthService',
  ['User', '$q', '$rootScope', function (User, $q, $rootScope) {

    function checkAuthority() {
      User.getRoles({id: $rootScope.currentUser.id}, function (response) {
        $rootScope.currentUser.hasAdminAuthority = (response.roles.indexOf('admin') !== -1);
      });
    }

    function getCurrentUser() {
      return $rootScope.currentUser;
    }

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

          checkAuthority();
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

          checkAuthority();
        });
    }

    return {
      login: login,
      logout: logout,
      register: register,
      refresh: refresh,
      getCurrentUser: getCurrentUser
    };
  }]);
