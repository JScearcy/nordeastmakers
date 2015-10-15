/**
 * Created by MrComputer on 10/7/15.
 */
app.controller('registerCtrl', ['$rootScope', '$scope', '$http', '$location', function ($rootScope, $scope, $http, $location) {


  //take first page and add to rootscope user
  $scope.userInfo = function(){

      if($scope.user.password === $scope.user.verifypassword) {

        $rootScope.user = $scope.user;
        console.log('entered', $rootScope.user );

        $http.post('/users', $rootScope.user)
            .then(function(res) {
                console.log(res);
                if(res.data.userexists){
                    $location.path("/");
                    $rootScope.user = {};
                }else{
                    //please do not delete
                    $rootScope.user.client_id = res.data.client_id;
                    $location.path("/register2");
                }

            });

        $scope.user = {};

    }else {


    }


  };

  //finish registration and delete rootscope user, route back to login
  $scope.signUp = function() {
    $rootScope.user.accountType = $scope.user.accountType
    $rootScope.user.cardName = $scope.user.cardName;
    $rootScope.user.cardNumber = $scope.user.cardNumber;
    $rootScope.user.expirationMonth = moment(new Date($scope.user.expiration)).format('MM');
    $rootScope.user.expirationYear = moment(new Date($scope.user.expiration)).format('YYYY');
    $scope.user = {};


    $http.post('/users/invoice', $rootScope.user)
        .then(function(res) {
            if(res.data.userexists){
                $location.path("/");
                $rootScope.user = {};
            }else{
                $location.path("/");
                $rootScope.user = {};
            }

        });

    $rootScope.user = {};
  };


}]);
