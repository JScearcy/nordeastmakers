app.controller('scheduledCtrl', ['$scope', '$http', '$location', 'hoursService', 'authService', function($scope, $http, $location,hoursService,authService){
  var user = authService.parseJwt(sessionStorage.getItem('userToken'))
  $scope.user = user;
  $scope.hours = new hoursService.dayHours();
  $scope.date = new Date();
  $scope.displaydate = moment($scope.date).format('MMM-DD-YYYY');

  $scope.minDate = new Date(
      $scope.date.getFullYear(),
      $scope.date.getMonth(),
      $scope.date.getDate());
  $scope.maxDate = new Date(
      $scope.date.getFullYear(),
      $scope.date.getMonth() + 1,
      $scope.date.getDate());

  $scope.updateScheduled = function(){
    return hoursService.machines(function(machines){
      $scope.machines = machines;
      displayReserved();
    });
  };
  $scope.updateScheduled();

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
