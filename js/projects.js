app.controller('projects', ['$scope', '$fetch', '$location', function($scope, $fetch, $location){
    $scope.projects = $fetch.getProjects();

    if(!$scope.projects){
        $scope.$on('projects', function(){
            $scope.projects = $fetch.projects;
        });
    }

    $scope.link = function(link){
        $location.path(link);
    };
}]);