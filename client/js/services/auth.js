angular
  .module('app')
  .factory('AuthService',
    ['User', '$q', '$rootScope', function (User, $q, $rootScope) {

      function checkAuthority() {
        /*jshint camelcase: false */
        User.prototype$__get__roles({'id': $rootScope.currentUser.id})
          .$promise
          .then(function (roles) {
            var hasAdminAuthority = false;

            if (roles) {
              roles.find(function (el) {
                if (el.name === 'admin') {
                  hasAdminAuthority = true;
                }
              });
            }

            $rootScope.currentUser.hasAdminAuthority = hasAdminAuthority;
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
              email: email,
              model: response
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
              email: userResource.email,
              model: userResource
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
