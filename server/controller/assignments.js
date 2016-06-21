var Assignment = require('mongoose').model('Assignment');
var exec = require('child_process').exec, execRemove;

exports.createAssignment = function(data) {

};

exports.getAssignment = function(req, res) {
    Assignment.find({_id:req.params.id}).exec(function(err, assignment) {
        //console.log(assignment);
        res.send(assignment[0]);
        //res.render("partials/run-assignment");
    });
};

exports.getAssignments = function(req, res) {

    Assignment.find({}).exec(function(err, collection) {
        res.send(collection);
    });
};
exports.deleteAssignment = function(req,res){
    Assignment.remove({_id:req.params.id}, function(err) {
        if (!err) {
            console.log("Check for success!");
            res.end('{"success" : "Removed", "status" : 200}');
        }
        else {
            console.log("Error!");
            res.end('{"success" : "NotRemoved", "status" : 200}');
        }
    });

    execRemove = exec("sudo rm -rf " + filepath, function (error, stdout, stderr) {
        if (error !== null) {
            console.log('Remove exec error: ' + error);
        }
    });
    execRemove.on('close', function () {
        console.log("Remove Complete");
    });

}
