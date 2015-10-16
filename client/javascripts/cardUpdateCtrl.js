app.controller('cardUpdateCtrl', ['$scope', '$http', 'authService','user', function($scope, $http, authService, user){
  $scope.user = user;
  $scope.saveCard = function () {
    var cardInfo = {
      username: $scope.user.username,
      cardName: $scope.user.cardName,
      cardNumber: $scope.user.cardNumber,
      expirationMonth: moment(new Date($scope.user.expiration)).format('MM'),
      expirationYear: moment(new Date($scope.user.expiration)).format('YYYY')
    };
    $scope.user.cardNumber = '';
    $scope.user.cardName = '';
    $scope.user.expiration = '';
    $http({
      method: 'PUT',
      url: '/users',
      data: cardInfo
    }).then(function(res){
      console.log(res);
    })
  }
}]);
