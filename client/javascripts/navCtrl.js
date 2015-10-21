/**
 * Created by MrComputer on 10/7/15.
 */
app.controller('navCtrl', ['$scope','$rootScope','$location', '$mdSidenav', '$mdUtil', '$log', 'authService', function($scope,$rootScope, $location, $mdSidenav, $mdUtil, $log, authService){
  $scope.workPaneUrl = '/private/scheduledMachines.html';
  var user = authService.parseJwt(sessionStorage.getItem('userToken'));
  $scope.accountType = user.accountType;
  $scope.close = function () {
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close LEFT is done");
        });
  };


  function buildToggler(navID) {
      var debounceFn =  $mdUtil.debounce(function(){
            $mdSidenav(navID)
              .toggle()
              .then(function () {
                $log.debug("toggle " + navID + " is done");
              });
          },200);
      return debounceFn;
    }
  $scope.toggleLeft = buildToggler('left');

  $scope.logout = function() {

      return authService.logout();

  };
  $scope.userButton = function(url) {
    $scope.workPaneUrl = url;
    $scope.close();
  };


}]);
