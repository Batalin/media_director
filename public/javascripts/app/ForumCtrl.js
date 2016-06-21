angular.module('app').controller('ForumCtrl', function($scope,$http,$route, Topic, Identity) {
    $scope.topics = Topic.query();
    //console.log(Topic.query());
    //$scope.title = "Forum";
    $scope.identity = Identity;

    $scope.newTopic = function (){
        var date = new Date();
        var dateAtime= date.getDate() + "." + (date.getMonth()+1) + "." + date.getFullYear() + " @ " + ('0'+date.getHours()).slice(-2) + ":"
            + ('0'+date.getMinutes()).slice(-2);
        var topicData = {
            title: $scope.title,
            date: dateAtime,
            author: Identity.currentUser.firstName + " " + Identity.currentUser.lastName,
            lastCommentAuthor: Identity.currentUser.firstName + " " + Identity.currentUser.lastName,
            replies: 0,
            message: $scope.message,
            authorId: Identity.currentUser._id
        }
        var newTopic = new Topic(topicData);
        newTopic.$save();
        /*console.log(newTopic);
        console.log("Hello World");*/
        $route.reload();

    }
    $scope.deleteTopic = function(id){

        //console.log("delete: " + id);
        $http.delete('/api/forum/'+id).then(
            function(response){
                // success callback
                console.log(response);
                $route.reload();
            },
            function(response){
                // failure call back
                console.log(response);
            }
        );

    }
    $scope.userEquals = function(currentUser,topicAuthorId){
        if (currentUser._id == topicAuthorId){
            return true;
        }else{
            return false;
        }

    }

})