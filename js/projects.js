app.controller('projects', ['$scope', '$fetch', function($scope, $fetch){
    $scope.projects = $fetch.getProjects();

    if(!$scope.projects){
        $scope.$on('home', function(){
            $scope.projects = $fetch.projects;
        });
    }
}]);
