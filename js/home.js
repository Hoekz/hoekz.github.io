app.controller('home', ['$scope', '$fetch', function($scope, $fetch){
    $scope.home = $fetch.getHome();

    if(!$scope.home){
        $scope.$on('home', function(){
            $scope.home = $fetch.home;
        });
    }
}]);