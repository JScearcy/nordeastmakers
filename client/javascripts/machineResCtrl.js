/**
 * Created by MrComputer on 10/7/15.
 */

 app.controller('machineResCtrl', ['$scope', '$http', '$location', '$mdDialog', function($scope, $http, $location, $mdDialog){
     function getMachines() {
        $scope.loading = true;
       $http({
         method: 'GET',
         url: '/tools'
       }).then(function(res){
           $scope.loading = false;
         $scope.machines = res.data;
       })
     }
     getMachines();
     $scope.openCalendar = function(index, ev) {
        $scope.loading = true;
       $mdDialog.show({
         controller: 'calendarCtrl',
         templateUrl: '/private/calendarDialog.html',
         parent: angular.element(document.body),
         targentEvent: ev,

         clickOutsideToClose: true,
         locals: {
           machine: $scope.machines[index]
         }

       }).then(function() {
           $scope.loading = false;
       });
       //.then is optional here
     };
 }]);
