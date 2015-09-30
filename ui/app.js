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
                        templateUrl : '/html/album.html',
                        controller : 'MainController'
                    }
                }
            })
    }])
/*
------------------------Controllers----------------------------
*/
    .controller('MainController', ['$rootScope', '$scope', function($rootScope, $scope) {
        $scope.album = {
            title: "Aug Birthday & Emp.Anniversary",
            description : "2015.08.28",
            photos: [
                {
                    name: 'IMG_1205.JPG',
                    path: '/imgs/IMG_1205.JPG'
                },
                {
                    name: 'IMG_1212.JPG',
                    path: '/imgs/IMG_1212.JPG'
                },
                {
                    name: 'IMG_1203.JPG',
                    path: '/imgs/IMG_1203.JPG'
                },
                {
                    name: 'IMG_1204.JPG',
                    path: '/imgs/IMG_1204.JPG'
                },
                {
                    name: 'IMG_1203.JPG',
                    path: '/imgs/IMG_1203.JPG'
                },
                {
                    name: 'IMG_1211.JPG',
                    path: '/imgs/IMG_1211.JPG'
                }
            ]
        };
        $scope.chosenPhoto =  $scope.album.photos[0];
        $scope.selectImg = function($index, img) {
            var img = '<img src="/imgs/' + img + '" class="img-responsive"/>';
            //start of new code new code

            var html = '';
            html += img;
            html += '<div style="height:25px;clear:both;display:block;">';
            html += '<a class="controls next" href="'+ ($index+2) + '">next &raquo;</a>';
            html += '<a class="controls previous" href="' + ($index) + '">&laquo; prev</a>';
            html += '</div>';
            var show = $('#myModal');
            show.modal();
            show.on('shown.bs.modal', function(){
                $('#myModal .modal-body').html(html);
                $('a.controls').trigger('click');
            }).on('hidden.bs.modal', function(){
                $('#myModal .modal-body').html('');
            });
        };

        $scope.selectImage = function(img) {
            $scope.chosenPhoto = img;
        };

        $scope.my_treedata = [{
            label: 'Languages',
            children: ['Jade','Less','Coffeescript']
        }]
    }])
;

$(document).on('click', 'a.controls', function(){
    var index = $(this).attr('href');
    var src = $('ul.row li:nth-child('+ index +') img').attr('src');

    $('.modal-body img').attr('src', src);

    var newPrevIndex = parseInt(index) - 1;
    var newNextIndex = parseInt(newPrevIndex) + 2;

    if($(this).hasClass('previous')){
        $(this).attr('href', newPrevIndex);
        $('a.next').attr('href', newNextIndex);
    }else{
        $(this).attr('href', newNextIndex);
        $('a.previous').attr('href', newPrevIndex);
    }

    var total = $('ul.row li').length + 1;
    //hide next button
    if(total === newNextIndex){
        $('a.next').hide();
    }else{
        $('a.next').show()
    }
    //hide previous button
    if(newPrevIndex === 0){
        $('a.previous').hide();
    }else{
        $('a.previous').show()
    }


    return false;
});
