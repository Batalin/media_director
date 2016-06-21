angular.module('app').controller('AssResultsCtrl', function($scope, Group, User, Assignment, $route, $routeParams, Video) {

  $scope.groups = Group.query();
  $scope.assignment = Assignment.get({_id:$routeParams.id});
  $scope.videos1 = {};
  $scope.videos = Video.query(); /*function(result) {
      result.forEach(function(element, index, arr){
       $scope.videos1[element.user] = arr[index];
    })
  });*/
  $scope.filterVideos = function(userID, assignment) {
    if(video.user == userID && video.assignment == assignment) {
      return true;
    }
    return false;
  }

})


angular.module('app').directive("videoResultLink", function(){
  return {
    restrict: "E",
    template: "<p ng-init=\"videohide=(video.user==member.id && video.assignment==assignment)\"></p><a ng-show='videohide' href='#'>{{video.created}} {{video.user}}</a>"
  }
});