angular.module('app').controller('ProfileCtrl', function($scope, Auth, Identity) {
    $scope.fname = Identity.currentUser.firstName;
    $scope.lname = Identity.currentUser.lastName;
    $scope.email = Identity.currentUser.loginName;
    $scope.roles = Identity.currentUser.roles;

    $scope.update = function () {
        var userDataToUpdate = {
            loginName: $scope.email,
            firstName: $scope.fname,
            lastName: $scope.lname
        };

        if($scope.password && $scope.password.length > 0) {
            userDataToUpdate.password = $scope.password;
        }

        Auth.updateUser(userDataToUpdate).then(function () {
            toastr.info('Profile data has been updated!');
        }, function (reason) {
            toastr.error(reason);
        });
    }
});