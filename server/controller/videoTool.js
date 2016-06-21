/**
 * Created by olegba on 3.12.2015.
 */


var fs = require('fs');

const pathCut = "public/assets/results/assignment1/";
const concatCommand = "ffmpeg -loglevel panic -i \"concat:public/assets/results/assignment1/result.mpg|public/assets/results/assignment1/cut.mpg\" -codec copy -vcodec copy -c copy -y public/assets/results/assignment1/result_temp.mpg";
const pathVideo = "public/assets/assignment1/videos/c";
const pathResult = "public/assets/results/assignment1/result.mpg";
const copyCommand = "cp public/assets/results/assignment1/result_temp.mpg public/assets/results/assignment1/result.mpg";
const convert = "ffmpeg -i public/assets/results/assignment1/result.mpg -qscale:v 5 -y public/assets/results/assignment1/result.mp4";


function getCutCommand(cut){
    var time1, time2, camera;
    var sec1, min1, durationMin, durationSec, duration;
    console.log(cut);
    time1 = cut.time1;
    time2 = cut.time2;
    camera = cut.camera;

    duration = time2 - time1;
    console.log(time2 + " - " + time1 + " = " + duration);
    durationMin = Math.floor(duration/60);
    durationSec = Math.round((duration%60)*100)/100;

    sec1 = Math.round((time1%60)*100)/100;
    min1 = Math.floor(time1/60);

    var T1 = "00:"+min1.toString()+":"+sec1.toString();
    var T2 = "00:"+durationMin.toString()+":"+durationSec.toString();

    command = "ffmpeg -loglevel panic -i " + pathVideo + camera.toString() + ".mpg -ss " + T1 + " -t " + T2 + " -async 1 -acodec copy -vcodec copy -y " + pathCut;
    return command;
}



exports.create = function(req, res) {
    var command = getCutCommand(req.body);
    var finalCut = command.final;
    var commandCut = command + "cut.mpg";
    commandCut[commandCut.length-1] = pathCut + "cut.mpg";


    var exec = require('child_process').exec, execCut, execConcat, execCopy, execConvert;


    if(!pathExists(pathResult)) {
        var commandFirstCut = command + "result.mpg";
        console.log(commandFirstCut);
        execCut = exec(commandFirstCut, function(error, stdout, stderr){
            //console.log('stdout: ' + stdout);
            //console.log('stderr: ' + stderr);
            if (error !== null) {
                //console.log('exec error: ' + error);
            }
        });
        res.send({success: true});
        return;
    }

    console.log(new Date() + "  " + commandCut);
    execCut = exec(commandCut, function (error, stdout, stderr) {
        //console.log('stdout: ' + stdout);
        //console.log('stderr: ' + stderr);
        if (error !== null) {
            //console.log('exec error: ' + error);
        }
    });

    execCut.on('close', function() {
        console.log(new Date() + "  " + concatCommand);
        execConcat = exec(concatCommand, function(error, stdout, stderr) {
            //console.log('stdout: ' + stdout);
            //console.log('stderr: ' + stderr);
            if (error !== null) {
                //console.log('exec error: ' + error);
            }
        });
        execConcat.on('close', function() {
            console.log(new Date() + "  " +copyCommand);
            execCopy = exec(copyCommand, function(error, stdout, stderr) {
                //console.log('stdout: ' + stdout);
                //console.log('stderr: ' + stderr);
                if (error !== null) {
                    //console.log('exec error: ' + error);
                }
            });
            if(req.body.final) {
                execCopy.on('close', function() {
                    console.log(new Date() + "  " + convert);
                    execConvert = exec(convert, function (error, stdout, stderr) {
                        //console.log('stdout: ' + stdout);
                        //console.log('stderr: ' + stderr);
                        if (error !== null) {
                            //console.log('exec error: ' + error);
                        }
                    });
                    execConvert.on('close', function() {
                        console.log(new Date() + " FINAL CLEAN ");
                        exec("rm -f public/assets/results/assignment1/result.mpg", function(error, stdout, stderr) {
                            //console.log('stdout: ' + stdout);
                            //console.log('stderr: ' + stderr);
                            if (error !== null) {
                                //console.log('exec error: ' + error);
                            }
                        })
                    });

                });

            }
        });

    });
    console.log("BEFORE RETURN");

    res.send({success: true})
}


function pathExists(path){
    if (fs.existsSync(path)) {
        return true;
    }
    return false;
}