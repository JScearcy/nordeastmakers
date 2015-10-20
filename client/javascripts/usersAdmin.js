app.controller('userAdminCtrl', ['$scope', '$http', '$location', '$rootScope', function($scope, $http, $location, $rootScope){
  function getUsers(){
  return $http({
    method: 'GET',
    url: '/users'
    }).then(function(res){
      $scope.users = res.data;
      console.log($scope.users);
    });
  }

  getUsers();

  $scope.updateUser = function(index) {
    $scope.loading = true;
    var data = $scope.users[index];
    $http({
      method: 'PUT',
      url: '/users',
      data: data
    }).then(function(res){
      $scope.loading = false;
      if(res.status == 200){
        getUsers();
      }
    });
  };

  $scope.deleteUser = function(index) {
    $scope.loading = true;
    console.log('this is the index on delete ' + index);
    var deletethem = {'username': $scope.users[index].username};
    console.log(deletethem);
    $http({
      method: 'DELETE',
      url: '/users',
      params: deletethem
    }).then(function(res){
      $scope.loading = false;
      if(res.status == 200){
        getUsers();
      }
    });
  };

}]);
