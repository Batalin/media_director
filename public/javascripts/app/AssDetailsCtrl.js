/**
 * Created by olegba on 09/02/16.
 */
angular.module('app').controller('AssDetailsCtrl', function ($scope, Assignment, $routeParams, Video, Identity, $route, $http) {
    $scope.assignment = Assignment.get({_id: $routeParams.id});
    $http.get('/api/videos/user/'+Identity.currentUser._id).then(function(response){
      $scope.videos = response.data;
    });
    $scope.test = function() {
      console.log($scope.videos);
    }
  /*

    }
      Video.get({user: Identity.currentUser._id}, function(result){
      console.log(result);
    });*/
    $scope.delete_video = function(param) {
        Video.delete({id: param});
        $route.reload();
    }
});