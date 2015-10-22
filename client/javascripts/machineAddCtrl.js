app.controller('machineAddCtrl', ['$scope', '$http', '$location', '$rootScope', function($scope, $http, $location, $rootScope){
  $scope.addMachine = function() {
    console.log("entered addMachine");
    data = $scope.machine;
    data.online = true;
    $scope.loading = true;
    $http({
      method: 'POST',
      url: '/tools',
      data: data
    }).then(function(res){
      $scope.loading = false;
      if(res.status == 200){
        $scope.machine = {};
      }
    });
  };
}]);
