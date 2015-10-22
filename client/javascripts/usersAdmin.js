app.controller('userAdminCtrl', ['$scope', '$http', '$location', '$rootScope', function($scope, $http, $location, $rootScope){
  function getUsers(){
  return $http({
    method: 'GET',
    url: '/users'
    }).then(function(res){
      $scope.users = res.data;
    });
  }

  getUsers();

  $scope.updateUser = function(index) {
    var data = $scope.users[index];
    $http({
      method: 'PUT',
      url: '/users',
      data: data
    }).then(function(res){
      if(res.status == 200){
        getUsers();
      }
    });
  };

  $scope.deleteUser = function(index) {
    var deletethem = {'username': $scope.users[index].username};
    $http({
      method: 'DELETE',
      url: '/users',
      params: deletethem
    }).then(function(res){
      if(res.status == 200){
        getUsers();
      }
    });
  };

    getUsers();

    $scope.updateUser = function (index) {
        $scope.loading = true;
        var data = $scope.users[index];
        $http({
            method: 'PUT',
            url: '/users',
            data: data
        }).then(function (res) {
            $scope.loading = false;
            if (res.status == 200) {
                getUsers();
            }
        });
    };

    $scope.deleteUser = function (index) {
        $scope.loading = true;
        var deletethem = {'username': $scope.users[index].username};
        $http({
            method: 'DELETE',
            url: '/users',
            params: deletethem
        }).then(function (res) {
            $scope.loading = false;
            if (res.status == 200) {
                getUsers();
            }
        });
    };

    $scope.updatePasswordForm = function (index, ev) {
        $mdDialog.show({
            controller: 'userAdminCtrl',
            templateUrl: '/private/updatePassword.html',
            parent: angular.element(document.body),
            targentEvent: ev,
            clickOutsideToClose: true,
            locals: {
                //user: user
            }
        }).then(function (err, data) {


        });
        //.then is optional here
    };

    $scope.updatePassword = function (user) {
        $scope.loading = true;
        var updatethem = {'password': user.newpassword, 'username': user.username};
        $http({
            method: 'PUT',
            url: '/users',
            params: updatethem
        }).then(function (res) {
            $scope.loading = false;
            if (res.status == 200) {
                getUsers();
            }
        }).finally(function () {
            $scope.loading = false;
        });
    };
}]);
