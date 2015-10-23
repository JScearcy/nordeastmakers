app.controller('updatePasswordCtrl', ['$scope', '$http', 'user', function($scope, $http, user){

    $scope.updatePassword = function () {
        $scope.loading = true;
        //console.log($scope.index, "scope.index");
        //console.log(user);
        console.log("this is the user", user);

        //$scope.users[index].username
        user.password = $scope.newpassword;
        console.log(user ,"after newpassword property added");

        $http({
            method: 'PUT',
            url: '/users',
            params: user
        }).then(function (res) {
            $scope.loading = false;

        }).finally(function () {
            $scope.loading = false;
        });
    };


}]);