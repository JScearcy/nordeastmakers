app.controller('toolAdminCtrl', ['$scope', '$http', '$location', '$rootScope', function($scope, $http, $location, $rootScope){
  function getTools(){
  return $http({
    method: 'GET',
    url: '/tools'
    }).then(function(res){
      $scope.machines = res.data;
    });
  };

  getTools();

  $scope.updateMachine = function(index) {
    var data = $scope.machines[index];
    console.log(data);
    $http({
      method: 'PUT',
      url: '/tools',
      data: data
    }).then(function(res){
      if(res.status == 200){
        getTools();
      }
    });
  };
  $scope.deleteMachine = function(index) {
    var data = $scope.machines[index];
    $http({
      method: 'DELETE',
      url: '/tools/' + data._id
    }).then(function(res){
      if(res.status == 200){
        getTools();
      }
    })
  }
}]);
