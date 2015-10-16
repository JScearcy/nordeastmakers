/**
 * Created by MrComputer on 10/7/15.
 */
app.controller('calendarCtrl', ['$scope', '$http', '$mdDialog', 'machine', 'authService', function($scope, $http, $mdDialog, machine, authService){
  //initialize the variables used through out the controller
  $scope.userId = authService.parseJwt(sessionStorage.getItem('userToken')).id;
  $scope.userType = authService.parseJwt(sessionStorage.getItem('userToken')).accountType;
  var username = authService.parseJwt(sessionStorage.getItem('userToken')).username;
  var allReservations = [];
  $scope.myDate = new Date();
  $scope.hours = new dayHours();
  //function to close calendar box
  $scope.hide = function() {
    $mdDialog.hide();
  };
  //function to close calendar box
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
//reservations construction
  $scope.reservation = {
    toolId: machine._id,
    date: new Date(),
    reservations: []
  };
  getReservations();
//create the min and max dates for the datepicker
  $scope.minDate = new Date(
      $scope.reservation.date.getFullYear(),
      $scope.reservation.date.getMonth(),
      $scope.reservation.date.getDate());
  $scope.maxDate = new Date(
      $scope.reservation.date.getFullYear(),
      $scope.reservation.date.getMonth() + 1,
      $scope.reservation.date.getDate());

//this controls adds or removes the id from a particular hour in the hours array
  $scope.addHourToggle = function(clickedHour){
    //first major if - checks if the item exists in the reservation array already - if so remove = true and the other ifs take that into account
    var remove = false;
    if($scope.reservation.reservations.length > 0){
      $scope.reservation.reservations.forEach(function(hour, index){
        if(hour.hr === clickedHour.hr){
          remove = true;
          $scope.reservation.reservations.splice(index, 1);
        }
      })
    };
    //second major if - if the machine has a max hours and the # of reservations has been met and it isnt a removal then it checks how many the user has in the array
    //it rejects the scheduling if the user would be over their hourly limit
    if(machine.dailyHours && $scope.reservation.reservations.length >= machine.dailyHours && !remove){
      var counter = 0;
      var maxReached = false;
      $scope.reservation.reservations.forEach(function(reservation, index){
        if($scope.userId == reservation.userId){
          counter++;
        }
        if(counter >= machine.dailyHours) {
          maxReached = true;
          return alert('Max time per day is ' + machine.dailyHours + ' hours');
        }
      });
      if(maxReached){
        return;
      }
    };
    //third major if - add the user id to the selected button and add it to the reservations array
    $scope.hours.forEach(function(hour, index){
      if(hour.hr === clickedHour.hr){
        $scope.hours[index].reserved = !$scope.hours[index].reserved;
        if(!remove){
          $scope.hours[index].userId = $scope.userId;
          $scope.hours[index].username = username;
          $scope.reservation.reservations.push($scope.hours[index]);
        } else if(remove){
          $scope.hours[index].userId = '';
          $scope.hours[index].username = '';
        }
      }
    });
    return
  }
//http post request to send updated reservation array for a given day
  $scope.reserveDate = function() {
      $scope.loading = true;
      if(!$scope.reservation.toolId){
        $scope.loading = false;
        return;
      }
      var reservation = $scope.reservation;
      reservation.date = momentDates(reservation.date);
      $http({
          method: 'POST',
          url: '/bookings',
          data: reservation
      }).then(function(res) {
        $scope.loading = false;
        getReservations();
      });
  }

  //if the date is not in YYYY-MM-DD format it will return it as such
  function momentDates(date) {
    if(date.toString().length != 10){
      return moment(new Date(date)).format('YYYY-MM-DD');
    } else {
      return date;
    }
  }

  //update the hours for the day selected by the day picker
  function updateHours(reservations) {
    $scope.reservation.reservations = [];
    $scope.hours = new dayHours();
    if(reservations.length > 0) {
      reservations.forEach(function(reservation, index){
        if(reservation.date == momentDates($scope.reservation.date)) {
          $scope.reservation.reservations = reservation.reservations;
        }
      })
    } else {
      $scope.hours = new dayHours();
    }

    if($scope.reservation.reservations.length > 0) {
      $scope.reservation.reservations.forEach(function(hour, index){
        $scope.hours.forEach(function(oldHour, index){
          if(hour.hr == oldHour.hr){
            $scope.hours[index] = hour;
          }
        })
      });
    }
  }

  //http call to get the existing reservations from the server
  function getReservations() {
    $http({
      method: 'GET',
      url: '/bookings/' + machine._id
    }).then(function(res){
      if(res.data.length > 0) {
        allReservations = res.data;
        updateHours(allReservations);
      } else {
        allReservations = [];
      }
    })
  }
  //when the date on the datepicker is changed this function is called
  $scope.updateDate = function(date) {
    $scope.reservation.date = $scope.myDate;
    updateHours(allReservations);
  }
//this function holds an untouched version of the hours available
  function dayHours() {
    var allhours = [{dispTime: '12 AM', hr: 0, reserved: false, userId: '', username: ''}, {dispTime: '1 AM', hr: 1, reserved: false, userId: '', username: ''}, {dispTime: '2 AM', hr: 2, reserved: false, userId: '', username: ''},
                    {dispTime: '3 AM', hr: 3, reserved: false, userId: '', username: ''}, {dispTime: '4 AM', hr: 4, reserved: false, userId: '', username: ''}, {dispTime: '5 AM', hr: 5, reserved: false, userId: '', username: ''},
                    {dispTime: '6 AM', hr: 6, reserved: false, userId: '', username: ''}, {dispTime: '7 AM', hr: 7, reserved: false, userId: '', username: ''}, {dispTime: '8 AM', hr: 8, reserved: false, userId: '', username: ''},
                    {dispTime: '9 AM', hr: 9, reserved: false, userId: '', username: ''}, {dispTime: '10 AM', hr: 10, reserved: false, userId: '', username: ''}, {dispTime: '11 AM', hr: 11, reserved: false, userId: '', username: ''},
                    {dispTime: '12 PM', hr: 12, reserved: false, userId: '', username: ''}, {dispTime: '1 PM', hr: 13, reserved: false, userId: '', username: ''}, {dispTime: '2 PM', hr: 14, reserved: false, userId: '', username: ''},
                    {dispTime: '3 PM', hr: 15, reserved: false, userId: '', username: ''}, {dispTime: '4 PM', hr: 16, reserved: false, userId: '', username: ''}, {dispTime: '5 PM', hr: 17, reserved: false, userId: '', username: ''},
                    {dispTime: '6 PM', hr: 18, reserved: false, userId: '', username: ''}, {dispTime: '7 PM', hr: 19, reserved: false, userId: '', username: ''}, {dispTime: '8 PM', hr: 20, reserved: false, userId: '', username: ''},
                    {dispTime: '9 PM', hr: 21, reserved: false, userId: '', username: ''}, {dispTime: '10 PM', hr: 22, reserved: false, userId: '', username: ''}, {dispTime: '11 PM', hr: 23, reserved: false, userId: '', username: ''}];
  return allhours;
}
}]);
