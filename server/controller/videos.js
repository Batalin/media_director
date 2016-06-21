/**
 * Created by olegba on 09/02/16.
 */
var Video = require('mongoose').model('Video');


exports.createVideo = function(req, res) {
    var data = req.body;
    Video.create(data, function(err, result) {
        console.log(err);
        if(err) {
            throw err;
        }
        res.send(result._id);
    });
};

exports.getVideo = function(req, res) {

    Video.find({_id:req.params.id.substr(req.params.id.indexOf("__")+2)}).exec(function(err, video) {
        if(err){
            throw err;
        }

        res.send(video);
    });
};

exports.getVideosByParam = function(req, res) {
    Video.find({user: req.params.id}).exec(function(err, videos) {
        if(err){
            throw err;
        }
        console.log(videos);

        res.send(videos);
    });
}


exports.getVideos = function(req, res) {

    Video.find({}).exec(function(err, collection) {
        if(err){
            throw err;
        }
        res.send(collection);
    });
};

exports.deleteVideo = function(req, res) {
    Video.remove({_id: req.params.id}).exec(function(err, result){
        if(err){
            throw err;
        }
        res.end('{"success" : "Updated", "status" : 200}');
    });
}