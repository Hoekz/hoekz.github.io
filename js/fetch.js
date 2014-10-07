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

    return self;
}]);