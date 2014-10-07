app.controller('navbar',['$scope', '$location', function($scope, $location){
    $scope.menu = [
        {name: 'Home', link: '/'},
        {name: 'About', link: '/about'},
        {name: 'Projects', link: '/projects'}
    ];
    $scope.$on('$routeChangeSuccess', function(){
        $scope.loc = $location.path();
    });
    $scope.loc = $location.path();
}]);