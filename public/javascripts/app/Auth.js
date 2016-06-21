angular.module('app').factory('Auth', function($http, Identity, $q, User) {
    return {
        authenticateUser: function (login, password) {
            var dfd = $q.defer();
            $http.post('/login', {username: login, password: password}).then(function(response) {
                if(response.data.success){
                    var user = new User();
                    angular.extend(user, response.data.user);
                  //console.log("before ident.currUser = user  " + Identity);
                    Identity.currentUser = user;
                    dfd.resolve(true);
                } else {
                    dfd.resolve(false);
                }
            });
            return dfd.promise;
        },
        createUser: function(userData) {
            var newUser = new User(userData);
            var dfd = $q.defer();
            newUser.$save().then(function(){
                Identity.currentUser = newUser;
                dfd.resolve();
            },function(response){
                dfd.reject(response.data.reason);
            });
            return dfd.promise;
        },
        logoutUser: function() {
            var dfd = $q.defer();
            $http.post('/logout', {logout: true}).then(function() {
                Identity.currentUser = undefined;
                dfd.resolve();
            });
            return dfd.promise;
        },
        hasRouteAccess: function (role) {
            if(Identity.hasAccess(role)) {
                return true;
            }else {
                $q.reject('not authorized');
            }
        },
        grantRouteAccess: function() {
            if(Identity.isAuthenticated()){
                return true;
            } else {
                $q.reject('not authorized!');
            }
        },
        updateUser: function(data){
            var df = $q.defer();
            var clone = angular.copy(Identity.currentUser);
            //console.log("clone " + JSON.stringify(clone));
            angular.extend(clone, data);
            //console.log("clone with data " + JSON.stringify(clone));
            clone.$update().then(function() {
                Identity.currentUser = clone;
                df.resolve();
            }, function(response) {
                df.reject(response.data.reason);
            });
            return df.promise;
        }

    }
});