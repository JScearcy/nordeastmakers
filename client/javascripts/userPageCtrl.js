app.controller('userPageCtrl', ['$scope', '$http', '$mdDialog', 'authService', function($scope, $http, $mdDialog, authService){
  var user = authService.parseJwt(sessionStorage.getItem('userToken'));
  function getUser(){
    $http({
      method: 'GET',
      url: '/users/' + user.username
    }).then(function(res){
      $scope.users = res.data;
    });
  }
  getUser();
  $scope.openCardUpdate = function(index, ev) {
    $mdDialog.show({
      controller: 'cardUpdateCtrl',
      templateUrl: '/private/cardUpdateDialog.html',
      parent: angular.element(document.body),
      targentEvent: ev,
      clickOutsideToClose: true,
      locals: {
        user: user
      }
    })
    //.then is optional here
  };
}]);
