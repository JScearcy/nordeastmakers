app.controller('toolAdminCtrl', ['$scope', '$http', '$location', '$rootScope', function($scope, $http, $location, $rootScope){
  function getTools(){
    $scope.loading = false;
  return $http({
    method: 'GET',
    url: '/tools'
    }).then(function(res){
      $scope.loading = false;
      $scope.machines = res.data;
    });
  }

  getTools();

  $scope.updateMachine = function(index) {
    var data = $scope.machines[index];
    $scope.loading = true;
    $http({
      method: 'PUT',
      url: '/tools',
      data: data
    }).then(function(res){
      $scope.loading = false;
      if(res.status == 200){
        getTools();
      }
    });
  };


  $scope.deleteMachine = function(index) {
    $scope.loading = true;
    var data = $scope.machines[index];
    $http({
      method: 'DELETE',
      url: '/tools/' + data._id
    }).then(function(res){
      $scope.loading = false;
      if(res.status == 200){
        getTools();
      }
    })
  };
}]);
