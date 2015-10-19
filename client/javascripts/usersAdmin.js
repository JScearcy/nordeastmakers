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
}]);
