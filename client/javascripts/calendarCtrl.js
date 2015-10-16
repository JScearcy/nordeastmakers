/**
 * Created by MrComputer on 10/7/15.
 */
app.controller('calendarCtrl', ['$scope', '$http', '$mdDialog', function($scope, $http, $mdDialog){
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  //date for datepicker!
  $scope.myDate = new Date();
  $scope.week = moment().week($scope.myDate);
  console.log($scope.myDate);
  $scope.minDate = new Date(
      $scope.myDate.getFullYear(),
      $scope.myDate.getMonth(),
      $scope.myDate.getDate());
  $scope.maxDate = new Date(
      $scope.myDate.getFullYear(),
      $scope.myDate.getMonth() + 1,
      $scope.myDate.getDate());
  $scope.hours = [{dispTime: '12 AM', hr: 0}, {dispTime: '1 AM', hr: 1}, {dispTime: '2 AM', hr: 2},
                 {dispTime: '3 AM', hr: 3}, {dispTime: '4 AM', hr: 4}, {dispTime: '5 AM', hr: 5},
                 {dispTime: '6 AM', hr: 6}, {dispTime: '7 AM', hr: 7}, {dispTime: '8 AM', hr: 8},
                 {dispTime: '9 AM', hr: 9}, {dispTime: '10 AM', hr: 10}, {dispTime: '11 AM', hr: 11},
                 {dispTime: '12 PM', hr: 12}, {dispTime: '1 PM', hr: 13}, {dispTime: '2 PM', hr: 14},
                 {dispTime: '3 PM', hr: 15}, {dispTime: '4 PM', hr: 16}, {dispTime: '5 PM', hr: 17},
                 {dispTime: '6 PM', hr: 18}, {dispTime: '7 PM', hr: 19}, {dispTime: '8 PM', hr: 20},
                 {dispTime: '9 PM', hr: 21}, {dispTime: '10 PM', hr: 22}, {dispTime: '11 PM', hr: 23}];

  // $scope.reservedDay = {
  //   day: $scope.myDate,
  //   hours: $scope.hours,
  //   tool: $scope.tool._id
  // }


  $scope.reserveDate = function() {

      $http({
          method: 'POST',
          url: '/calendar'
      }).success(function(res) {
          console.log("date added!!!");
      });

  }

  $scope.getDates = function() {

      $http({
          method: 'GET',
          url: '/calendar'
      }).success(function(data) {

          $scope.calendar = data;

      });

  }
}]);
