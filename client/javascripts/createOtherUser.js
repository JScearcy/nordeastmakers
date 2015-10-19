app.controller('createOtherUser', ['$rootScope', '$scope', '$http', '$location', function ($rootScope, $scope, $http, $location) {


  //take first page and add to rootscope user
  $scope.newUser = function(){

      if($scope.user.password === $scope.user.verifypassword) {

        $rootScope.user = $scope.user;
        $rootScope.user.billDate = '9999-99-99';
        $http.post('/free_user', $rootScope.user)
            .then(function(res) {
                  alert('Success');
                  $rootScope.user = {};
            });
        $scope.user = {};
    }
  };

}]);
