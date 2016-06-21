var busboy = require("connect-busboy");
var fs = require('fs');
var multer = require('multer');
var mongoose = require('mongoose');

var assignmentModel = require('mongoose').model('Assignment');
var i=0;

var MAX_FILE_NUMBER = 4;
var EXTENSION;
var DUPLICATE=false;
var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        assignmentModel.find({title:req.body.title}).exec(function(err, collection){
            for(var key in collection) {
                if(req.body.description == collection[key].description && req.body.task==collection[key].task){
                    console.log("duplicate");
                    DUPLICATE=true;
                }
            }
        });
        console.log("reqData: " +req.body.title + req.body.description + req.body.task);
        var filepath=__dirname+"/../files/"+req.body.title.split(' ').join('_')+"/";
        if (!fs.existsSync(filepath)){
            fs.mkdirSync(filepath);
        }
        callback(null, filepath);
    },
    filename: function (req, file, callback) {

        var filename = file.originalname;
        if(!filename) filename = "NoFile";
        EXTENSION = filename.slice(filename.indexOf('.'),filename.length);

        if(req.body['video'+(i+1)]) {
            i++
            //console.log(req.body['video'+i]);
            filename = req.body['video' + i] + EXTENSION;
            //console.log(file);
        }
        callback(null, filename);

    }
});
var upload = multer({ storage : storage}).array('file',MAX_FILE_NUMBER);


exports.load = function(req,res){
    //res.end('{"success" : "success", "status" : 200}');
    var assignmentTitle;
    var assignmentId;
    var assignment = new assignmentModel();
    if(!DUPLICATE) {
        upload(req, res, function (err) {
            var data = req.body;

            if (err) {
                console.log("error: " + err);
                return res.end("Error uploading file.");
            } else {
                console.log("success!");
                res.redirect("assignments");
            }

            console.log(i);


            //res.end("File is uploaded");
            assignment.title = data.title;
            assignmentTitle = data.title;
            assignment.description = data.description;
            assignment.task = data.task;
            //Save to Database and cut the videos
            assignment.input_number = i;
            i = 0;
            assignment._id = mongoose.Types.ObjectId();
            assignmentId = assignment._id;
            assignment.duration = "--"; //CHANGE AT VIDEO CONVERSION
            //console.log("done i =" + i);
            //console.log(assignment);
            console.log(assignment);
            assignment.save(function (err) {
                if (err) throw err;

                console.log('Assignment saved successfully!');
                //res.redirect('back');
            });


            var exec = require('child_process').exec, execRename, execConcatL, execConcatM, execInfo, execConvertL, execConvertM, execMoveL, execMoveM, execRemove, execCreateThumb
                , execConvert1, execConvert2, execConvert3, execConvert4;
            assignmentTitle = assignmentTitle.split(' ').join('_');
            var path = "/home/mebop/director-simulator/server/files/" + assignmentTitle;
            var renameCommand = "sudo mv " + path + " " + path + assignmentId;
            var path = path + assignmentId + "/";
            var concatCommandL = 'ffmpeg -i ' + path + 'Camera1.mpg -i ' + path + 'Camera2.mpg -i ' + path + 'Camera3.mpg -i ' + path + 'Camera4.mpg -filter_complex \"nullsrc=size=1280x180 [base]; [0:v] setpts=PTS-STARTPTS, scale=320x180 [upperleft]; [1:v] setpts=PTS-STARTPTS, scale=320x180 [upperright]; [2:v] setpts=PTS-STARTPTS, scale=320x180 [lowerleft]; [3:v] setpts=PTS-STARTPTS, scale=320x180 [lowerright]; [base][upperleft] overlay=shortest=1 [tmp1]; [tmp1][upperright] overlay=shortest=1:x=320 [tmp2]; [tmp2][lowerleft] overlay=shortest=1:x=640:y=0 [tmp3]; [tmp3][lowerright] overlay=shortest=1:x=960:y=0\" -c:v libx264 ' + path + 'lineviewOutL.mpg';
            var concatCommandM = 'ffmpeg -i ' + path + 'Camera1.mpg -i ' + path + 'Camera2.mpg -i ' + path + 'Camera3.mpg -i ' + path + 'Camera4.mpg -filter_complex \"nullsrc=size=1920x270 [base]; [0:v] setpts=PTS-STARTPTS, scale=480x270 [upperleft]; [1:v] setpts=PTS-STARTPTS, scale=480x270 [upperright]; [2:v] setpts=PTS-STARTPTS, scale=480x270 [lowerleft]; [3:v] setpts=PTS-STARTPTS, scale=480x270 [lowerright]; [base][upperleft] overlay=shortest=1 [tmp1]; [tmp1][upperright] overlay=shortest=1:x=480 [tmp2]; [tmp2][lowerleft] overlay=shortest=1:x=960:y=0 [tmp3]; [tmp3][lowerright] overlay=shortest=1:x=1440:y=0\" -c:v libx264 ' + path + 'lineviewOutM.mpg';
            var concatCommandH = 'ffmpeg -i ' + path + 'Camera1.mpg -i ' + path + 'Camera2.mpg -i ' + path + 'Camera3.mpg -i ' + path + 'Camera4.mpg -filter_complex \"nullsrc=size=2880x405 [base]; [0:v] setpts=PTS-STARTPTS, scale=720x405 [upperleft]; [1:v] setpts=PTS-STARTPTS, scale=720x405 [upperright]; [2:v] setpts=PTS-STARTPTS, scale=720x405 [lowerleft]; [3:v] setpts=PTS-STARTPTS, scale=720x405 [lowerright]; [base][upperleft] overlay=shortest=1 [tmp1]; [tmp1][upperright] overlay=shortest=1:x=720 [tmp2]; [tmp2][lowerleft] overlay=shortest=1:x=1440:y=0 [tmp3]; [tmp3][lowerright] overlay=shortest=1:x=2160:y=0\" -c:v libx264 ' + path + 'lineviewOutH.mpg';
            //var infoCommand = "ffmpeg -i "+path+"lineviewOut.mpg";

            function convert(itemName, ext1, ext2) {
                if (ext1 != ext2) {
                    return "sudo ffmpeg -i " + path + itemName + ext1 + " -strict -2 " + path + itemName + ext2;
                } else {
                    return " ";
                }
            }

            //var convertCommandTomp4 = convert("lineviewOut",EXTENSION,".mpg");
            //var convertCommandTompg = "sudo ffmpeg -i "+path+"lineviewOut"+EXTENSION+" -strict -2 "+path+"lineviewOut.mp4";

            //var filepath=__dirname+"/../files/"+req.body.title.split(' ').join('_')+"/";

            var filepath = "/home/mebop/director-simulator/public/assets/assignments/" + assignmentTitle + assignmentId;

            if (!fs.existsSync(filepath)) {
                fs.mkdirSync(filepath);
            }

            execRename = exec(renameCommand, function (error, stdout, stderr) {
                if (error !== null) {
                    console.log('Rename exec error: ' + error);
                }
            });
            execRename.on('close', function () {
                execConvert1 = exec(convert("Camera1", EXTENSION, ".mpg"), function (error, stdout, stderr) {
                    if (error !== null) {
                        console.log('Initial Convert exec error: ' + error);
                    }
                });
                execConvert1.on('close', function () {
                    console.log("Camera1 converted!");
                    execConvert2 = exec(convert("Camera2", EXTENSION, ".mpg"), function (error, stdout, stderr) {
                        if (error !== null) {
                            console.log('Initial Convert exec error: ' + error);
                        }
                    });
                    execConvert2.on('close', function () {
                        console.log("Camera2 converted!");
                        execConvert3 = exec(convert("Camera3", EXTENSION, ".mpg"), function (error, stdout, stderr) {
                            if (error !== null) {
                                console.log('Initial Convert exec error: ' + error);
                            }
                        });
                        execConvert3.on('close', function () {
                            console.log("Camera3 converted!");
                            execConvert4 = exec(convert("Camera4", EXTENSION, ".mpg"), function (error, stdout, stderr) {
                                if (error !== null) {
                                    console.log('Initial Convert exec error: ' + error);
                                }
                            });
                            execConvert4.on('close', function () {
                                console.log("Camera4 converted!");
                                execConcatL = exec(concatCommandL, function (error, stdout, stderr) {
                                    if (error !== null) {
                                        console.log('Low Concat exec error: ' + error);
                                    }
                                });
                                execConcatL.on('close', function () {
                                    console.log("Low Concatenation complete!");
                                    execConcatM = exec(concatCommandM, function (error, stdout, stderr) {
                                        if (error !== null) {
                                            console.log('Medium Concat exec error: ' + error);
                                        }
                                    });
                                    execConcatM.on('close',function(){
                                        console.log('Medium Concat complete');

                                        execConvertL = exec(convert("lineviewOutL", ".mpg", ".mp4"), function (error, stdout, stderr) {
                                            if (error !== null) {
                                                console.log('Low Convert exec error: ' + error);
                                            }
                                        });
                                        execConvertL.on('close', function () {
                                            console.log("Low Converting Complete");
                                            execConvertM = exec(convert("lineviewOutM", ".mpg", ".mp4"), function (error, stdout, stderr) {
                                                if (error !== null) {
                                                    console.log('Medium Convert exec error: ' + error);
                                                }
                                            });
                                            execConvertM.on('close',function(){
                                                console.log("Medium Converting Complete");

                                                execMoveL = exec("sudo mv " + path + "lineviewOutL.mp4 " + filepath + "/", function (error, stdout, stderr) {
                                                    if (error !== null) {
                                                        console.log('Low move exec error: ' + error);
                                                    }
                                                });
                                                execMoveL.on('close', function () {
                                                    console.log("Low Move Complete");
                                                    execMoveM = exec("sudo mv " + path + "lineviewOutM.mp4 " + filepath + "/", function (error, stdout, stderr) {
                                                        if (error !== null) {
                                                            console.log('Medium move exec error: ' + error);
                                                        }
                                                    });
                                                    execMoveM.on('close',function(){
                                                        console.log("Medium Move Complete");
                                                        var duration;
                                                        //parse duration
                                                        execInfo = exec("sudo ffmpeg -i "+filepath+"/lineviewOutL.mp4",function(error,stdout,stderr){
                                                            console.log("stdout: " + stdout);
                                                            console.log("stderr: " + stdout);
                                                            if (error !== null) {
                                                                console.log('Info exec error: ' + error);
                                                                var startPosition = error.message.indexOf("Duration: ")+"Duration: ".length;
                                                                duration=error.message.slice(startPosition,startPosition + 8);
                                                            }
                                                        });
                                                        execInfo.on('close',function(){
                                                            console.log("Info exec closed");
                                                            assignmentModel.findById(assignmentId, function (err, doc) {
                                                                doc.duration = duration;
                                                                doc.save(function (err) {
                                                                    if (err) {
                                                                        console.log(err);
                                                                    }
                                                                })
                                                            });
                                                            execCreateThumb = exec("sudo ffmpeg -i "+filepath+"/lineviewOutL.mp4 -ss 00:00:30.000 -vframes 1 "+filepath+"/thumb.png",function(error,stdout,stderr){
                                                                if(error!==null){
                                                                    console.log("Thumbnail creation error: " + error);
                                                                }
                                                            });
                                                            execCreateThumb.on('close',function() {
                                                                console.log("Thumbnail creation complete");
                                                                execRemove = exec("sudo rm " + path + "lineviewOut*", function (error, stdout, stderr) {
                                                                    if (error !== null) {
                                                                        console.log('Remove exec error: ' + error);
                                                                    }
                                                                });
                                                                execRemove.on('close', function () {
                                                                    DUPLICATE = false;
                                                                    console.log("Remove Complete");
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }else{
        res.redirect("assignments");
    }
}