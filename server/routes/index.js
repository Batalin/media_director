var express = require('express');
var router = express.Router();
var videoTool = require('../controller/videoTool');
var auth = require('../controller/auth');
var loadFile = require('../controller/loadFile');

var mongoose = require('mongoose');
var User = mongoose.model('User');
var users = require('../controller/users');
var assignments = require('../controller/assignments');
var videos = require('../controller/videos');
var topics = require('../controller/topics');
var topicMessages = require('../controller/topicMessages');
var groups = require('../controller/groups');
var Group = require('mongoose').model('Group');



/* API for User resource */

router.get('/api/users', auth.requiresRole('admin'), users.getUsers);
router.post('/api/users', users.createUser);
router.put('/api/users', users.updateUser);


/* API for Assignment resource */

router.get('/api/assignments', assignments.getAssignments);
router.get('/api/assignments/:id', assignments.getAssignment);
router.post('/api/assignments', auth.requiresRole('admin'),assignments.createAssignment);
router.delete('/api/assignments/:id', assignments.deleteAssignment);

/* API for forum and topic resources*/

router.get('/api/forum', topics.getTopics);
router.post('/api/forum', topics.postTopic);
router.delete('/api/forum/:id', topics.deleteTopic);

router.get('/api/forum_topic', topicMessages.getTopicMessages);
router.post('/api/forum_topic', topicMessages.postTopicMessage);
router.delete('/api/forum_topic/:id', topicMessages.deleteTopicMessage);
router.post('/api/forum_topic/:id', topicMessages.updateTopicMessage);

/* API for video resource */

router.get('/api/videos', videos.getVideos);
router.get('/api/videos/:id', videos.getVideo);
router.post('/api/videos', videos.createVideo);
router.get('/api/videos/user/:id', videos.getVideosByParam);
router.delete('/api/videos/:id', videos.deleteVideo);

/* API for group resource */

router.get('/api/groups/:id', function(req, res){
  Group.find({_id:req.params.id}).exec(function(err, group) {
    if(err){
      throw err;
    }
    res.send(group[0]);
  });
});
router.get('/api/groups', groups.getGroups);
router.post('/api/groups', groups.createGroup);
router.put('/api/groups', groups.updateGroup);
router.delete('/api/groups/:id', groups.deleteGroup);

/*      ROUTES    */



router.get('/assignments/:id/details', function(req, res){
    res.render('partials/ass-details');
});

router.get('/partials/:path', function(req, res) {
    res.render('partials/'+ req.params.path);
});

router.get('/partials/viewResult/:id', function(req, res) {
    var path = req.params.id, result;
    result = path.substr(0,path.indexOf("__"));
    res.render('partials/viewResult', {video_path: result});
});

router.get('/partials/run-assignmentL/:id/:resolution', function(req,res) {
    var path = req.params.id;
    var result = path.substr(0, path.indexOf("__"))+path.substr(path.indexOf("__")+2)+"/lineviewOutL.mp4";
    res.render('partials/run-assignment', {video_path: result});
});
router.get('/partials/run-assignmentM/:id/:resolution', function(req,res) {
    var path = req.params.id;
    var result = path.substr(0, path.indexOf("__"))+path.substr(path.indexOf("__")+2)+"/lineviewOutM.mp4";
    res.render('partials/run-assignment', {video_path: result});
});

router.get('/partials/admin/:path', function(req, res) {
    res.render('partials/admin/'+ req.params.path);
});

router.get('/Line', function(req, res){
    res.render('partials/Line');
})


router.get('/views/includes/:path',function(req, res) {
    res.render('includes/' + req.params.path);
});

router.post('/login', auth.authenticate);

router.post('/logout', function(req, res) {
    req.logOut();
    res.end();
});

router.get('/api/*',  function(req, res) {
    res.sendStatus(404);
})

//file load request
router.post("/upload_videos", loadFile.load);

router.get('*', function(req, res) {
    res.render('index', {
        loggedUser: req.user
    });
});

module.exports = router;
