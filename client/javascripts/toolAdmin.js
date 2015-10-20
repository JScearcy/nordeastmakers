
app.controller('toolAdminCtrl', ['$scope', '$http', '$location', 'toolService', function($scope, $http, $location, toolService){
  //function to pull all tools and update the scope
  function updateMachines(machines){
    $scope.machines = machines
  }


  toolService.getTools(updateMachines(machines));
//if an admin makes a change this will update the tool
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
        toolService.getTools(updateMachines(machines));
      }
    });
  };

//admin tool to delete machine

  $scope.deleteMachine = function(index) {
    $scope.loading = true;
    var data = $scope.machines[index];
    $http({
      method: 'DELETE',
      url: '/tools/' + data._id
    }).then(function(res){
      $scope.loading = false;
      if(res.status == 200){
        toolService.getTools(updateMachines(machines));
      }
    })
  };
}]);
