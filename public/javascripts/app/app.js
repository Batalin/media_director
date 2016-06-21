angular.module('app', ['ngResource', 'ngRoute']).config(function($routeProvider, $locationProvider, $sceProvider) {
        console.log("config ......");
        $sceProvider.enabled(false);
        var routeAccess = {
                    admin: {auth: function(Auth ) {
                            return Auth.hasRouteAccess('admin');
                        }
                    },
                    user: {auth: function(Auth ) {
                        return Auth.grantRouteAccess();
                        }
                    }
        };

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        $routeProvider
            .when('/', {templateUrl: '/partials/main', controller: 'MainCtrl'})
            .when('/admin/users', {templateUrl: '/partials/admin/userList', controller: 'UserListCtrl', resolve: routeAccess.admin})
            .when('/register', {templateUrl: '/partials/register',controller: 'RegisterCtrl'})
            .when('/new_assignment', {templateUrl: '/partials/upload-video', controller: 'NewAssCtrl', resolve: routeAccess.admin})
            .when('/profile', {templateUrl: '/partials/profile', controller: 'ProfileCtrl', resolve: routeAccess.user})
            .when('/assignments', {templateUrl: '/partials/assignments', controller: 'AssignmentsCtrl'})
            .when('/new_assignment', {templateUrl: '/partials/upload-video', controller: 'NewAssCtrl', resolve: routeAccess.admin})
            .when('/assignments/:id', {templateUrl: '/partials/ass-details', controller: 'AssDetailsCtrl'})
            .when('/run-assignmentL/:id/:resolution', {
                templateUrl: function(params) {
                return '/partials/run-assignmentL/' + params.id + '/320';
                },
                controller: 'RunAssignmentCtrl'})
            .when('/run-assignmentM/:id/:resolution', {
                templateUrl: function(params) {
                    return '/partials/run-assignmentM/' + params.id + '/480';
                },
                controller: 'RunAssignmentCtrl'})
            .when('/videos/:id', {
                templateUrl: function(params) {
                    var ass = params.id.substr(0,params.id.indexOf("__"));
                    var video_id = params.id.substr(params.id.indexOf("__")+2);
                    return '/partials/viewResult/' + ass + "__" + video_id;
                },
                controller: 'FinalCtrl'})
            .when('/forum', {templateUrl: '/partials/forum', controller: 'ForumCtrl'})
            .when('/forum/:title/:id', {templateUrl: '/partials/forum_topic', controller:'ForumTopicCtrl'})
            .when('/admin/groups', {templateUrl: '/partials/admin/groupList', controller: 'GroupsCtrl'})
            .when('/admin/new-group', {templateUrl: '/partials/admin/groupAdd', controller: 'NewGroupCtrl'})
            .when('/admin/groups/:id', {templateUrl: '/partials/admin/groupDetails', controller: 'GroupCtrl'})
            .when('/assignment_results/:id', {templateUrl: '/partials/admin/assignmentResults', controller: 'AssResultsCtrl'});
});




angular.module('app').run(function($rootScope, $location) {
        $rootScope.$on('$routeChangeError', function(evt, current, previous, rejection) {
            if(rejection === 'not authorized') {
                $location.path('/');
            }
        });
        console.log("Run ........");
    });

angular.module('app').controller('MainCtrl', function($scope, Identity) {
   $scope.myVar = "MainCtrl in main partials ";
   $scope.identity = Identity;
  console.log(Identity);
});



angular.module('app').controller('LoginCtrl', function($scope, $http, Identity, Auth,$location) {
    $scope.identity = Identity;
    $scope.signin = function (login, password) {
        Auth.authenticateUser(login, password).then(function(success) {
           if(success){
               toastr.info("logged in!");
           } else {
               toastr.info("failed to login!");
           }
        });
    }
    $scope.signout = function() {
        Auth.logoutUser().then(function () {
            $scope.username = "";
            $scope.password = "";
            toastr.info('You have successfully sign out!');

            $location.path('/');
        })
    }
});