app.controller('userPageCtrl', ['$scope', '$http', 'authService', function($scope, $http, authService){
  var user = authService.parseJwt(sessionStorage.getItem('userToken'));
  function getUser(){
    $http({
      method: 'GET',
      url: '/users/' + user.username
    }).then(function(res){
      console.log(res.data);
      $scope.users = res.data;
    });
  }
  getUser();
}]);
