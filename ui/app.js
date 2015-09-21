'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', ['ui.router'])
/*
------------------------Configurations----------------------------
*/
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');
        $stateProvider
            .state('home', {
                url : '/home',
                views: {
                    "main" : {
                        templateUrl : '/html/home.html',
                        controller : 'MainController'
                    }
                }
            })
    }])
/*
------------------------Controllers----------------------------
*/
    .controller('MainController', ['$rootScope', '$scope', function($rootScope, $scope) {
        $scope.welcomeText = "Welcome to Niteco!";
    }])
;
