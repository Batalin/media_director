angular.module('app').factory('Video', function($resource) {
    var VideoResource = $resource(
        '/api/videos/:id',
        {id:'@id'},
        {
            update: {method: 'PUT', isArray: false},
            get:    {method: 'GET', isArray: true},
            delete:{method:'DELETE'}
        }
    );

    return VideoResource;
})