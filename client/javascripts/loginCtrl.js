/**
 * Created by MrComputer on 10/7/15.
 */
app.controller('loginCtrl', ['$scope', '$http', '$location', '$rootScope', 'authService', function($scope, $http, $location, $rootScope, authService){

    $scope.login = function(){

        $scope.loading = true;

        $http.post('/login', $scope.user)
            .then(function (response) {
                sessionStorage.setItem('userToken', response.data);
                var parsedtoken = authService.parseJwt(response.data);
                $rootScope.username = parsedtoken.username;

                switch(parsedtoken.accountType) {
                    case 'standard':
                        $location.path("/user");
                        break;
                    case 'business':
                        $location.path("/business");
                        break;
                    case 'admin':
                        $location.path("/admin");
                        break;
                    default: $location.path("/");
                }

            }).finally(function() {

                $scope.loading = false;

            });
    };
}]);
