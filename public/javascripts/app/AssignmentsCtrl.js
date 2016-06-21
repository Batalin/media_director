angular.module('app').controller('AssignmentsCtrl', function($scope, Assignment, Identity, $route, $http) {
    $scope.assignments = Assignment.query();
    $scope.title = "Assignments list";
    $scope.identity = Identity;
    $scope.deleteAssignment = function (id){
        $http.delete('/api/assignments/'+id).then(
            function(response){
                // success callback
                if(response.data.success=="Removed") {
                    $route.reload();
                }else{
                    $window.location.href = '/';
                }

            },
            function(response){
                // failure call back
                console.log(response);
            }
        );

    }
})