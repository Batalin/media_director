angular.module('app').controller('UserListCtrl', function ($scope, User) {
    $scope.users = User.query();
    $scope.addAdminRole = function(user) {
      user.roles.push('admin');
      user.$update;
    }

})