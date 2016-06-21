angular.module('app').factory('Topic', function($resource) {
    var TopicResource = $resource(
        '/api/forum/:_id',
        {_id:'@id'},
        {update: {method: 'PUT', isArray: false},
            get:    {method: 'GET', isArray: true},
            post: {method: 'PUT', isArray: true},
            delete:{method:'DELETE', isArray:true}
        }
    );


    return TopicResource;
})