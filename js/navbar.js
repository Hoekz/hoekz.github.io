app.controller('navbar',['$scope', '$location', function($scope, $location){
    $scope.menu = [
        {name: 'Home', link: '%2F'},
        {name: 'About', link: '%2Fabout'},
        {name: 'Projects', link: '%2Fprojects'}
    ];
    $scope.$on('$routeChangeSuccess', function(){
        $scope.loc = $location.path();
    });
    $scope.loc = $location.path();
}]);