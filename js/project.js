app.controller('project', ['$scope', '$fetch', '$routeParams', function($scope, $fetch, $routeParams){
    var name = $routeParams.project;

    $scope.project = $fetch.getProject(name);
    $scope.viewFile = {};
    $scope.show = function(i){
        $scope.viewFile.index = i;
        $fetch.getFile($scope.project.files[i]);
    };

    $scope.$on('file', function(){
        $scope.viewFile.code = $fetch.file;
        $scope.viewFile.type = $scope.project.files[$scope.viewFile.index].split('.').pop();
        if($scope.viewFile.type == 'js') $scope.viewFile.type = 'javascript';
        if($scope.viewFile.type == 'py') $scope.viewFile.type = 'python';
        setTimeout(Prism.highlightAll, 50);
    });

    if(!$scope.project){
        $scope.$on('project', function(){
            $scope.project = $fetch.project[name];
            $scope.show(0);
        });
    }else{
        $scope.show(0);
    }
}]);