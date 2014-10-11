app.controller('about', ['$scope', '$fetch', function($scope, $fetch){
    $scope.about = $fetch.getAbout();

    if(!$scope.about){
        $scope.$on('about', function(){
            $scope.about = $fetch.about;
            console.log($scope.about);
        });
    }
}]);