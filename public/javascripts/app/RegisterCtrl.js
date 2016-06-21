angular.module('app').controller('RegisterCtrl', function($scope, $location, Auth) {
    $scope.register = function() {
        var userData = {
            loginName: $scope.email,
            password: $scope.pwd,
            firstName: $scope.fname,
            lastName: $scope.lname
        }

        Auth.createUser(userData).then(function() {
            toastr.info("Account has been created!");
            $location.path('/');
        }, function(reason) {
            toastr.error(reason);
        });
    }
});