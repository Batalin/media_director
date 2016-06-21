angular.module('app').factory('TopicMessage', function($resource) {
    var TopicMessageResource = $resource(
        '/api/forum_topic/:_id',
        {_id:'@id'},
        {update: {method: 'PUT', isArray: true},
            get:    {method: 'GET', isArray: true},
            post: {method: 'PUT', isArray: true},
            delete:{method:'PUT', isArray:true}
        }
    );


    return TopicMessageResource;
})