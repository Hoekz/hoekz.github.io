app.controller('project', ['$scope', '$fetch', function($scope, $fetch){
    $scope.project = $fetch.getProject(name);

    if(!$scope.project){
        $scope.$on('home', function(){
            $scope.project = $fetch.project;
        });
    }
}]);