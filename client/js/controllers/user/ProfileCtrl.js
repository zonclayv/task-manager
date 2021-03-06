angular
  .module('app').controller('ProfileCtrl',
  ['$stateParams', '$scope', 'User', '$state',
    function ($stateParams, $scope, User, $state) {

      function getUser() {
        User
          .findById({id: $stateParams.id})
          .$promise
          .then(function (result) {
            $scope.selectedUser = result;
          });
      }

      getUser();

      $scope.fileChanged = function (file) {
        $scope.file = file;
      };

      $scope.saveUser = function () {

        var userAttr = {
          firstname: $scope.selectedUser.firstname,
          lastname: $scope.selectedUser.lastname,
          email: $scope.selectedUser.email
        };

        if ($scope.file && $scope.file.files[0]) {
          var reader = new FileReader();

          reader.onload = function (readerEvt) {
            var binaryString = readerEvt.target.result;
            userAttr.picture = $scope.selectedUser.picture = btoa(binaryString);
            User.updateAll(
              {where: {id: $scope.selectedUser.id}},
              userAttr,
              function () {
                getUser();
              });
          };

          reader.readAsBinaryString($scope.file.files[0]);
          return;
        }

        $scope.selectedUser.$prototype$patchAttributes(userAttr);
      };

      $scope.cancel = function () {
        $state.go('home');
      };

    }]);
