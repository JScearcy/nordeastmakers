/**
 * Created by MrComputer on 10/7/15.
 */
 app.controller('adminCtrl', ['$scope', '$http', '$location', '$mdUtil', '$mdSidenav', function($scope, $http, $location, $mdUtil, $mdSidenav){
   $scope.workPaneUrl = '/admin/addMachine.html';

   $scope.close = function () {
       $mdSidenav('left').close()
         .then(function () {
           //$log.debug("close LEFT is done");
         });
   };

   function buildToggler(navID) {
       var debounceFn =  $mdUtil.debounce(function(){
             $mdSidenav(navID)
               .toggle()
               .then(function () {
                 //$log.debug("toggle " + navID + " is done");
               });
           },200);
       return debounceFn;
     }
   $scope.toggleLeft = buildToggler('left');


   $scope.adminButton = function(url) {
     $scope.workPaneUrl = url;
     $scope.close();
   };
}]);
