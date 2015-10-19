/**
 * Created by MrComputer on 10/7/15.
 */
var app = angular.module('nordeastMakers', ['ngRoute', 'ngMaterial', 'angular-jwt']);

app.config(['$routeProvider', '$locationProvider', '$httpProvider', 'jwtInterceptorProvider',
    function ($routeProvider, $locationProvider, $httpProvider, jwtInterceptorProvider) {
        $locationProvider.html5Mode(true);

        jwtInterceptorProvider.tokenGetter = function(){
          return sessionStorage.getItem('userToken');
        };
        $httpProvider.interceptors.push('jwtInterceptor');

        $routeProvider.
            when('/', {
                templateUrl: '/views/signin.html',
                controller: 'loginCtrl'
            }).
            when('/register', {
                templateUrl: '/views/signup.html',
                controller: 'registerCtrl'
            }).
            when('/register2', {
                templateUrl: '/views/signup2.html',
                controller: 'registerCtrl'
            }).
            when('/user', {
                templateUrl: '/private/standard.html',
                controller: 'navCtrl'
            }).
            when('/admin', {
                templateUrl: '/admin/admin.html',
                controller: 'adminCtrl'
            }).
            when('/business', {
                templateUrl: '/business/business.html',
                controller: 'navCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
    }]);


app.directive('isMatch', function() {
    return {
        require: 'ngModel',
        scope: {
            otherVal: "=isMatch"
        },
        link: function (scope, elem, attr, ngModel) {
            ngModel.$validators.isMatch = function (modelVal) {
                return modelVal === scope.otherVal;
            };
            scope.$watch('otherVal', function () {
                ngModel.$validate();
            });
        }
    };


});

