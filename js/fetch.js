app.factory('$fetch', ['$http', '$rootScope', function($http, $root){
    var self = this;

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
        console.log('getting about');
        if(self.about){
            return self.about;
        }else{
            console.log('requesting about');
            $http.get('json/about.json').success(function(data){
                console.log('about received');
                self.about = data;
                console.log(data);
                var getNext = function(i){
                    console.log('section ' + i + ' received');
                    $http.get(self.about.sections[i].content).success(function(data){
                        self.about.sections[i].content = data.split('\n');
                        if(i == self.about.sections.length - 1)
                            $root.$broadcast('about');
                        else
                            getNext(i + 1);
                    });
                };
                getNext(0);
            });
            return false;
        }
    };

    return self;
}]);