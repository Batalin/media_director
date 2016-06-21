angular.module('app').controller('NewGroupCtrl', function($scope, Group, $location) {
  $scope.createGroup = function() {

    var groupData = {
      title: $scope.title,
      created: new Date(),
      members: []
    }
    var newGroup = new Group(groupData);
    newGroup.$save().then(function() {
      console.log('after group creation');
      $location.path('/admin/groups');
    }, function(reason) {
      toastr.error(reason);
    });
  }
});