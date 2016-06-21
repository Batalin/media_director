var Group = require('mongoose').model('Group');

exports.getGroup = function(reg, res) {
  console.log(req.params.id);
  Group.find({_id:req.params.id}).exec(function(err, group) {
    if(err){
      console.log(err);
      throw err;
    }
    console.log(group);
    res.send(group[0]);
  });
}

exports.getGroups = function(req, res) {
  Group.find({}).exec(function(err, collection) {
    if(err){
      throw err;
    }
    res.send(collection);
  })
}

exports.createGroup = function(req, res) {
  var data = req.body;
  console.log(req.body);
  Group.create(data, function(err, result) {
    console.log(err);
    if(err) {
      throw err;
    }
    res.send(result._id);
  });
}

exports.updateGroup = function(req, res) {
    console.log(req.body);
    Group.update({_id:req.body._id}, {members: req.body.members}, {safe: false}, function(err) {
      if(err) { res.status(400); return res.send({reason:err.toString()});}
      res.status(200);
      res.end();
    });
}


exports.deleteGroup = function(req, res) {
  Group.remove({_id: req.params.id}).exec(function(err, result){
    if(err){
      throw err;
    }
    res.end('{"success" : "Updated", "status" : 200}');
  });
}
/*
exports.addMember = function() {

}

exports.deleteMember = function() {

}*/