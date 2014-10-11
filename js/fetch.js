app.factory('$fetch', ['$http', '$rootScope', function($http, $root){
    var self = this;
    self.project = {};

    self.getHome = function(){
        if(self.home){
            return self.home;
        }else{
            $http.get('json/home.json').success(function(data){
                self.home = data;
                $root.$broadcast('home');
            });
            return false;
        }
    };

    self.getAbout = function(){
        if(self.about){
            return self.about;
        }else{
            $http.get('json/about.json').success(function(data){
                self.about = data;
                $http.get(self.about.bio.content).success(function(data){
                    self.about.bio.content = data;
                    console.log(data);
                    $root.$broadcast('about');
                });
            });
            return false;
        }
    };

    self.getProjects = function(){
        if(self.projects){
            return self.projects;
        }else{
            $http.get('json/projects.json').success(function(data){
                self.projects = data;
                $root.$broadcast('projects');
            });
            return false;
        }
    };

    self.getProject = function(name){
        if(self.project[name]){
            return self.project[name];
        }else{
            $http.get('/json/projects/' + name + '.json').success(function(data){
                self.project[name] = data;
                $root.$broadcast('project');
            });
            return false;
        }
    };

    self.getFile = function(file){
        $http.get(file).success(function(data){
            self.file = data;
            $root.$broadcast('file');
        });
    };

    return self;
}]);