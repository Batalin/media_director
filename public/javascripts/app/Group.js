angular.module('app').service('Group', function($resource) {
  var GroupResource = $resource(
    '/api/groups/:id',
    {id:'@id'},
    {update: {method: 'PUT', isArray: false}}
  );

  return GroupResource;
})