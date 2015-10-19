/**
 * Created by MrComputer on 10/7/15.
 */
app.controller('calendarCtrl', ['$scope', '$http', '$mdDialog', 'machine', 'authService', 'hoursService', function($scope, $http, $mdDialog, machine, authService, hoursService, maxmet){
  //initialize the variables used through out the controller
  $scope.userId = authService.parseJwt(sessionStorage.getItem('userToken')).id;
  $scope.userType = authService.parseJwt(sessionStorage.getItem('userToken')).accountType;
  var username = authService.parseJwt(sessionStorage.getItem('userToken')).username,
      accountType = authService.parseJwt(sessionStorage.getItem('userToken')).accountType,
      allReservations = [],
      userReservations = [],
      addedReservations = [],
      otherReservations = [],
      removedReservations = [];

  $scope.myDate = new Date();
  $scope.hours = new hoursService.dayHours;
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
    if(clickedHour.userId.length > 0 && clickedHour.userId != $scope.userId && accountType === 'admin'){
      removedReservations.push(clickedHour);
      remove = true;
    };
    if(userReservations.length > 0){
      userReservations.forEach(function(hour, index){
        if(hour.hr === clickedHour.hr){
          remove = true;
          removedReservations.push(userReservations.splice(index, 1)[0]);
          if(addedReservations.length > 0){
            addedReservations.forEach(function(added, index){
              if(removedReservations[removedReservations.length - 1].hr == added.hr){
                addedReservations.splice(index, 1);
              }
            })
          }
        }
      })
    };
    if(removedReservations.length > 0 && !remove){
      removedReservations.forEach(function(hour, index){
        if(hour.hr === clickedHour.hr){
          removedReservations.splice(index, 1);
        }
      })
    };
    //second major if - if the machine has a max hours and the # of reservations has been met and it isnt a removal then it checks how many the user has in the array
    //it rejects the scheduling if the user would be over their hourly limit
    if(machine.dailyHours && userReservations.length >= machine.dailyHours && !remove){
      var counter = 0;
      var maxReached = false;
      userReservations.forEach(function(reservation, index){
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
    if(machine.weeklyHours && !remove){
      var currentWeek = new hoursService.currentWeek($scope.myDate);
      console.log(currentWeek);
    }
    //third major if - add the user id to the selected button and add it to the reservations array
    $scope.hours.forEach(function(hour, index){
      if(hour.hr === clickedHour.hr){
        $scope.hours[index].reserved = !$scope.hours[index].reserved;
        if(!remove){
          $scope.hours[index].userId = $scope.userId;
          $scope.hours[index].username = username;
          userReservations.push($scope.hours[index]);
          addedReservations.push($scope.hours[index]);
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
      reservation.date = hoursService.momentDates(reservation.date);

    //disables loading screen if no reservation made
      if(addedReservations.length == 0){

          $scope.loading = false;
        }

      if(addedReservations.length > 0){

        reservation.reservations = addedReservations;
        $http({
            method: 'POST',
            url: '/bookings',
            data: reservation
        }).then(function(res) {
            $scope.loading = false;
            if(removedReservations.length > 0){
              reservation.reservations = removedReservations;
              $http({
                method: 'DELETE',
                url:'/bookings',
                data: reservation,
                headers: {"Content-Type": "application/json;charset=utf-8"}
              }).then(function(res){
                $scope.loading = false;
                getReservations()
              });
            } else {
                $scope.loading = false;
                getReservations();
            }
        });
      } else if(removedReservations.length > 0) {
          $scope.loading = true;
          reservation.reservations = removedReservations;
          $http({
            method: 'DELETE',
            url:'/bookings',
            data: reservation,
            headers: {"Content-Type": "application/json;charset=utf-8"}
          }).then(function(res){
            $scope.loading =false;
            getReservations()
          })
      }
  }

  //update the hours for the day selected by the day picker
  function updateHours(reservations) {
    userReservations = [];
    addedReservations = [];
    removedReservations = [];
    $scope.hours = new hoursService.dayHours();
    if(reservations.length > 0) {
      reservations.forEach(function(reservation, index){
        if(reservation.date === hoursService.momentDates($scope.reservation.date)) {
          reservation.reservations.forEach(function(reservation, index){
            if(reservation.username === username){
              userReservations.push(reservation);
            } else {
              otherReservations.push(reservation);
            }
            $scope.hours.forEach(function(oldHour, index){
              if(reservation.hr == oldHour.hr){
                $scope.hours[index] = reservation;
              }
            });
          });
        }
      });
    } else {
      $scope.hours = new hoursService.dayHours();
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

}]);
