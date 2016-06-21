angular.module('app').factory('Identity', function($window, User) {
    var currentUser;
    if(!!$window.loggedUser) {
        currentUser = new User();
        angular.extend(currentUser, $window.loggedUser);
    }
    return {
        currentUser: currentUser,
        isAuthenticated: function() {
            return this.currentUser;
        },
        hasAccess: function(role) {
            return !!this.currentUser && this.currentUser.roles.indexOf(role) > -1;
        }
    }
})