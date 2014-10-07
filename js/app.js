var app = angular.module('app',['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, loc){
    $routeProvider
        .when('/',{
            templateUrl: '/html/home.html',
            controller: 'home'
        })
        .when('/about',{
            templateUrl: '/html/about.html',
            controller: 'about'
        })
        .when('/projects',{
            templateUrl: '/html/projects.html',
            controller: 'projects'
        })
        .when('/projects/:project',{
            templateUrl: '/html/project.html',
            controller: 'project'
        })
        .otherwise({redirectTo: '/'});
    loc.html5Mode(true);
}]);