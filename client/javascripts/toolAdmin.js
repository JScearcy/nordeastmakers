app.controller('toolAdminCtrl', ['$scope', '$http', '$location', 'toolService', function($scope, $http, $location, toolService){
  //function to pull all tools and update the scope
  var updateMachines = function(machines){
    $scope.machines = machines;
  }

  toolService.getTools(updateMachines);
//if an admin makes a change this will update the tool
  $scope.updateMachine = function(index) {
    var data = $scope.machines[index];
    $http({
      method: 'PUT',
      url: '/tools',
      data: data
    }).then(function(res){
      if(res.status == 200){
        toolService.getTools(updateMachines);
      }
    });
  };
//admin tool to delete machine
  $scope.deleteMachine = function(index) {
    var data = $scope.machines[index];
    $http({
      method: 'DELETE',
      url: '/tools/' + data._id
    }).then(function(res){
      if(res.status == 200){
        toolService.getTools(updateMachines);
      }
    })
  };
}]);
