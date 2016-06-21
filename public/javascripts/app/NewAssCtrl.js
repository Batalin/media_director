angular.module('app').controller('NewAssCtrl',  function($scope, Assignment) {
    var submit = false;
    $scope.validate = function(){
        return submit;
    }
    var showMessage = false;
    var clicked =false;
    $scope.showMessage = function(){
        return showMessage;
    }
    $scope.print = function() {
        var data = {
            title : $scope.title,
            description : $scope.description
        }

        var newAss = new Assignment(data);
        console.log($scope.title + " " + $scope.description);
        console.log(newAss);
    }

    $scope.uploadVideos = function(){

        setTimeout(function(){
            if(!clicked) {
                clicked=true;
                submit = true;
                document.getElementById("submitButton").click();
                setTimeout(function () {
                    submit = false;
                }, 500);
            }
        }, 100);
        showMessage=true;
    }

});