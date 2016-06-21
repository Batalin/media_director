angular.module('app').controller('ForumTopicCtrl', function($scope, $http,$route,$window, TopicMessage, Identity,$routeParams, $q) {

    $scope.topicMessages = TopicMessage.query();
    //console.log(Topic.query());
    //$scope.title = "Forum";
    $scope.identity = Identity;
    //console.log("id : " + id);
    $scope.title = $routeParams.title;
    $scope.topicId = $routeParams.id;
    /*$route.reload = function() {
        $route.reload();
    }*/
    $scope.newTopicMessage = function (){
        var date = new Date();
        var dateAtime= date.getDate() + "." + (date.getMonth()+1) + "." + date.getFullYear() + " @ " + ('0'+date.getHours()).slice(-2) + ":"
            + ('0'+date.getMinutes()).slice(-2);
        var topicMessageData = {
            topicId: $routeParams.id,
            date: dateAtime,
            author: Identity.currentUser.firstName + " " + Identity.currentUser.lastName,
            message: $scope.message,
            authorId: Identity.currentUser._id
        }
        var newTopicMessage = new TopicMessage(topicMessageData);
        newTopicMessage.$save();
        $route.reload();

    }
    $scope.deleteTopicMessage = function(id){

        console.log("delete: " + id);
        $http.delete('/api/forum_topic/'+id).then(
            function(response){
                // success callback
                if(response.data.success=="Message") {
                    $route.reload();
                }else{
                    $window.location.href = '/forum';
                }

            },
            function(response){
                // failure call back
                console.log(response);
            }
        );

    }
    $scope.updateTopicMessage = function(id){
        console.log("update: " + id);
        console.log("message: " + document.getElementById("message-area:"+id).value);
        var date = new Date();
        var dateAtime= date.getDate() + "." + (date.getMonth()+1) + "." + date.getFullYear() + " @ " + ('0'+date.getHours()).slice(-2) + ":"
            + ('0'+date.getMinutes()).slice(-2);
        var data = {
            "date":dateAtime,
            "id":id,
            "message": document.getElementById("message-area:"+id).value
        };

        $http.post("/api/forum_topic/"+id, JSON.stringify({ "objectData": data})).success(function(response){
            //console.log(response);
            $route.reload();
        });

    }
    $scope.editTopicMessage = function(id){
        console.log("edit: " + id);

        document.getElementById("message-area:"+id).disabled = false;

    }
    $scope.userEquals = function(currentUser,topicAuthorId){
        if (currentUser._id == topicAuthorId){
            return true;
        }else{
            return false;
        }

    }
    $scope.adjustHeight=function(id){
        var textarea = document.getElementById("message-area:"+id);
        textarea.style.overflow = 'hidden';
        textarea.style.height = 0;
        textarea.style.height = textarea.scrollHeight + 'px';
        textarea.style.minHeight = "75px";
        return true;
    }
    /*var elements = document.getElementsByTagName("textarea");
    for (var element in elements) {
        element.style.overflow = 'hidden';
        element.style.height = 0;
        element.style.height = element.scrollHeight + 'px';
    }*/
})