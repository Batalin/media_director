angular.module('app').controller('GroupCtrl', function($scope, $routeParams,  Group, User, $filter, $route) {
  $scope.group;
  Group.get({id: $routeParams.id},
    //success
    function(result) {
      $scope.group = result;
    },
    //error
    function(error) {
      console.log(error);
    }
  );
  $scope.users = [];
  User.query(
    //success
    function(result) {
      $scope.users = result;
    },
    //error
    function(error) {
      console.log(error);
    }
  );
  $scope.filteredUsers = []


  $scope.filterUsers = function() {
    $scope.filteredUsers = [];
    for(var i=0; i<$scope.users.length;i++) {
      if(contains($scope.group.members, $scope.users[i]._id)) {
        console.log("check if user in group " + $scope.users[i].loginName);
      }else{
        console.log("user is not in the group " + $scope.users[i].loginName);
        $scope.filteredUsers.push($scope.users[i]);
      }
    }
  }

 // console.log("users " + $scope.users);
  $scope.selectUsers = function () {
    $scope.selectedUsers = $filter('filter')($scope.users, {checked: true});
  }

  $scope.removeUserFromGroup = function(userID) {

    for(var i = 0; i < $scope.group.members.length; i++){
      if($scope.group.members[i].id == userID) {
        $scope.group.members.splice(i,1);
      }
    }
    $scope.group.$update(function(result) {
      $scope.group = result;
    });
  }

  $scope.addUsersToGroup = function() {
    for(var i=0; i < $scope.selectedUsers.length; i++) {
      if(contains($scope.group.members, $scope.selectedUsers[i]._id)) {
        continue;
      } else {
        $scope.group.members.push({id: $scope.selectedUsers[i]._id, name: $scope.selectedUsers[i].firstName + " " + $scope.selectedUsers[i].lastName});
      }
    }
    $scope.group.$update(function(result) {
      $scope.group = result;
    });

  }

  function contains(arr, id) {
    for(var i=0; i<arr.length; i++) {
      if(arr[i].id == id) return true;
    }
    return false;
  }

  function updateUserList() {
    $scope.users.filter(function(element) {
        if(contains($scope.group.members, element._id)) {
          return false
        }
      return true;
    });
  }

});