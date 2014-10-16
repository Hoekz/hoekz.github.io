var app = angular.module('app',['ngRoute', 'ngAnimate']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, loc){
    $routeProvider
        .when('/',{
            templateUrl: 'html/home.html',
            controller: 'home'
        })
        .when('/about',{
            templateUrl: 'html/about.html',
            controller: 'about'
        })
        .when('/projects',{
            templateUrl: 'html/projects.html',
            controller: 'projects'
        })
        .when('/project/:project',{
            templateUrl: '/html/project.html',
            controller: 'project'
        })
        .otherwise({redirectTo: '/'});
    loc.html5Mode(true);
}]);

app.filter("trust", ['$sce', function($sce){
    return function(text){
        return $sce.trustAsHtml(text);
    };
}]);

var scrollSpeed = 0;
var scroll = 0;
document.addEventListener('keydown', function(e){
    if(e.keyCode == 40) scrollSpeed = 25;
    if(e.keyCode == 38) scrollSpeed = -25;
    return false;
});

setInterval(function(){
    scroll = window.scrollY;
    scroll += scrollSpeed;
    window.scrollTo(0, scroll);
    scroll = window.scrollY;
    scrollSpeed *= .8;
    if(Math.abs(scrollSpeed) < .005) scrollSpeed = 0;
}, 20);