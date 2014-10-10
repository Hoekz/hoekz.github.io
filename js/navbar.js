app.controller('navbar',['$scope', '$location', function($scope, $location){
    $scope.menu = [
        {name: 'Home', link: '/'},
        {name: 'About', link: '/about'},
        {name: 'Projects', link: '/projects'}
    ];
    $scope.$on('$routeChangeSuccess', function(){
        $scope.loc = $location.path();
    });

    $scope.link = function(link){
        $location.path(link);
    };

    var page = localStorage.getItem('redirect');

    if(page){
        $location.path(page);
        localStorage.removeItem('redirect');
    }

    $scope.loc = $location.path();
}]);