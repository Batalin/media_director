angular.module('app').factory('Assignment', function($resource) {
    var AssignmentResource = $resource(
        '/api/assignments/:_id',
        {_id:'@id'},
        {update: {method: 'PUT', isArray: false},
         get:    {method: 'GET', isArray: false}
        }
    );


    return AssignmentResource;
})
