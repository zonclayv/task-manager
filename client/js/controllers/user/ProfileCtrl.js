angular
  .module('app').controller('ProfileCtrl',
  ['$stateParams', '$scope', 'User', '$state', 'FileUploader', 'Container',
    function ($stateParams, $scope, User, $state, FileUploader, Container) {

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
