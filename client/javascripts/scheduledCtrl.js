app.controller('scheduledCtrl', ['$scope', '$http', '$location', 'hoursService', 'authService', function($scope, $http, $location,hoursService,authService){
  var user = authService.parseJwt(sessionStorage.getItem('userToken'))
  $scope.user = user;
  $scope.hours = new hoursService.dayHours();
  $scope.date = new Date();
  $scope.displaydate = moment($scope.date).format('MMM-DD-YYYY');
  $scope.active = user.active;
  $scope.billDate = moment(user.billDate).add(1, 'month').format('MMM-DD-YYYY');

  $scope.minDate = new Date(
      $scope.date.getFullYear(),
      $scope.date.getMonth(),
      $scope.date.getDate());
  $scope.maxDate = new Date(
      $scope.date.getFullYear(),
      $scope.date.getMonth() + 1,
      $scope.date.getDate());

  $scope.updateScheduled = function(){
    $scope.displaydate = moment($scope.date).format('MMM-DD-YYYY');
    return hoursService.machines(function(machines){
      $scope.machines = machines;
      displayReserved();
    });
  };
  $scope.updateScheduled();

  var userReservations = [],
      otherReservations = [];

  var displayReserved = function(){
    var ln1 = $scope.machines.length;
    while(ln1--){
      hoursService.getReservations(ln1, $scope.machines[ln1]._id, hoursService, function(ln1, reserve){
        if($scope.machines[ln1]){
         $scope.machines[ln1].reservations = hoursService.updateHours(reserve, $scope.date, user);
        }
      })
    }
  }

}]);
