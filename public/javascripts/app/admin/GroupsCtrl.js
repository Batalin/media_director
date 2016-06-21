angular.module('app').controller('GroupsCtrl', function($scope, Group, $route) {
  $scope.groups = Group.query();

  $scope.deleteGroup = function(param) {

    Group.delete({id: param});
    $route.reload();

  }

});