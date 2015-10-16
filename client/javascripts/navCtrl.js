/**
 * Created by MrComputer on 10/7/15.
 */
app.controller('navCtrl', ['$scope','$rootScope','$location', '$mdSidenav', '$mdUtil', '$log', 'authService', function($scope,$rootScope, $location, $mdSidenav, $mdUtil, $log, authService){
  $scope.workPaneUrl = '/private/machines.html';

  $scope.close = function () {
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close LEFT is done");
        });
  };

  $scope.reserveMachine = function() {
    $scope.workPaneUrl = '/private/machines.html';
  }
  $scope.reportIssue = function() {
    $scope.workPaneUrl = '/private/report.html'
  }
  function buildToggler(navID) {
      var debounceFn =  $mdUtil.debounce(function(){
            $mdSidenav(navID)
              .toggle()
              .then(function () {
                $log.debug("toggle " + navID + " is done");
              });
          },200);
      return debounceFn;
    };
  $scope.toggleLeft = buildToggler('left')

  $scope.logout = function() {

      return authService.logout();
  }

}]);
