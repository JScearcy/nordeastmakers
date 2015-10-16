app.controller('scheduledCtrl', ['$scope', '$http', '$location', 'hoursService', 'authService', function($scope, $http, $location,hoursService,authService){
  var user = authService.parseJwt(sessionStorage.getItem('userToken'))
  $scope.hours = new hoursService.dayHours();
  $scope.date = new Date();

  hoursService.machines(function(machines){
    $scope.machines = machines;
    displayReserved();
  });

  var userReservations = [],
      otherReservations = [];

  var displayReserved = function(){
    $scope.machines.forEach(function(machine, index){
      hoursService.getReservations(machine._id, hoursService, function(reserve){
        $scope.machines[index].reservations = hoursService.updateHours(reserve, $scope.date, user);
      })
    });
  }

}]);
