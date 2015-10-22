app.controller('userAdminCtrl', ['$scope', '$http', '$location', '$rootScope', '$mdDialog', function($scope, $http, $location, $rootScope, $mdDialog){
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
        console.log('this is the index on delete ' + index);
        var deletethem = {'username': $scope.users[index].username};
        console.log(deletethem);
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

    $scope.updatePasswordForm = function (user, ev) {
        console.log("this thing", user);
        $mdDialog.show({
            controller: 'updatePasswordCtrl',
            templateUrl: '/private/updatePassword.html',
            parent: angular.element(document.body),
            targentEvent: ev,
            clickOutsideToClose: true,
            locals: {user: user}

        }).then(function (data) {

            console.log("this is the thing", data);
        });
        //.then is optional here
    };


}]);
