/**
 * Created by MrComputer on 10/7/15.
 */

 app.controller('machineResCtrl', ['$scope', '$http', '$location', '$mdDialog', function($scope, $http, $location, $mdDialog){
     function getMachines() {
       $http({
         method: 'GET',
         url: '/tools'
       }).then(function(res){
         $scope.machines = res.data;
       })
     }
     getMachines();
     $scope.openCalendar = function(index, ev) {
       $mdDialog.show({
         controller: 'calendarCtrl',
         templateUrl: '/private/calendarDialog.html',
         parent: angular.element(document.body),
         targentEvent: ev,
         clickOutsideToClose: true,
         locals: {
           machine: $scope.machines[index]
         }
       })
       //.then is optional here
     };
 }]);
