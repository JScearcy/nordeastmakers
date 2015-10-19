app.service('hoursService',['$http', function($http){
  var serviceThis = this;
  this.dayHours = function () {
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
  this.machines = function(cb) {
    return $http({
      method: 'GET',
      url: '/tools'
    }).then(function(res){
      cb(res.data);
    });
  }
  this.getReservations = function(id, hoursService, cb) {
    return $http({
      method: 'GET',
      url: '/bookings/' + id
    }).then(function(res){
      cb(res.data);
    })
  }
  this.momentDates = function(date) {
    if(date.toString().length != 10){
      return moment(new Date(date)).format('YYYY-MM-DD');
    } else {
      return date;
    }
  }
  this.updateHours = function(reservations, date, user) {
    var hours = new serviceThis.dayHours();
    if(reservations.length > 0) {
      reservations.forEach(function(reservation, index){
        if(reservation.date === serviceThis.momentDates(date)) {
          reservation.reservations.forEach(function(reservation, index){
            hours.forEach(function(oldHour, index){
              if(reservation.hr == oldHour.hr && user.username == reservation.username){
                hours[index] = reservation;
              }
            });
          });
        }
      });
    } else {
      hours = new serviceThis.dayHours();
    }
    return hours
  }
  this.getSunday = function(date) {
    date = new Date(date);
    var day = date.getDay(),
        diff = date.getDate() - day;
    return new Date(date.setDate(diff));
  }
  this.currentWeek = function(dayPicked){
    var thisSunday = serviceThis.getSunday(dayPicked);
    var thisWeek = [];
    for(var i = 0; i <= 6; i++){
      thisWeek.push(moment(moment().day(thisSunday + i).format('YYYY-MM-DD')));
    };
    return thisWeek;
  }
  this.weeklyCounter = function(machines) {

  }
}]);
