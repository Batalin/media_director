angular.module('app').controller('AssResultsCtrl', function ($scope, Group, User, Video) {
  $scope.groups = Group.query();

})