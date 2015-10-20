app.controller('reportCtrl', ['$scope', '$http', '$location', 'toolService', 'authService', function($scope, $http, $location, toolService, authService){
  //parse user
    var user = authService.parseJwt(sessionStorage.getItem('userToken'));
    //add email to email input
    $scope.user = {
      user: user.username
    }
    //pull tools and add to scope
    function updateTools(){
        return toolService.getTools(function(machines){
        $scope.machines = machines;
      });
    }
    updateTools();
    //report issue and update tools
    $scope.sendReport = function(){
      $scope.report.username = user.username;
      $http({
        method: 'POST',
        url: '/issues',
        data: $scope.report
      }).then(function(res){
        updateTools();
      })
    }

}]);
