/**
 * Created by Cell on 08-Feb-16.
 */
angular.module('app').controller('FinalCtrl', function($scope, Video, $routeParams) {

    var isPlayed = false;
    var videoObj = Video.get({id:$routeParams.id.substr($routeParams.id.indexOf("_")+1)});
    var videoIterator = 0;
    var subtitleIterator = 0;
    var effectIterator = 0;
    var video = document.getElementById("video");
    var playButton = document.getElementById("buttonPlay");
    var videoW = video.offsetWidth,
        videoH = video.offsetHeight;
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    $scope.play_pause = isPlayed ? 'Pause' : 'Play';

    $scope.play = function() {
        isPlayed = !isPlayed;
        $scope.play_pause = isPlayed ? 'Pause' : 'Play';
        if(isPlayed){
            video.play();
        }else{
            video.pause();
        }
    }
    $scope.mute = function mute(){
        video.muted=!video.muted;
      $scope.muted = video.muted;
    }

    canvas.width = 960;
    canvas.height = 540;

    video.addEventListener("play", drawVideo, false);

    $scope.restart = function() {
        if(isPlayed){
            $scope.play();
        }
        video.currentTime = 0;
        videoIterator = 0;
        subtitleIterator = 0;
        effectIterator = 0;
    }

    function drawVideo(){
        if(video.paused || video.ended) return;

        if(videoIterator < videoObj[0].cut.length){
            if(video.currentTime < videoObj[0].cut[videoIterator].time2) {

                switch (videoObj[0].cut[videoIterator].camera){
                    case 1:
                        context.drawImage(video,0,0,480,270,0,0,960,540);
                        break;
                    case 2:
                        context.drawImage(video,480,0,480,270,0,0,960,540);
                        break;
                    case 3:
                        context.drawImage(video,960,0,480,270,0,0,960,540);
                        break;
                    case 4:
                        context.drawImage(video,1440,0,480,270,0,0,960,540);
                        break;
                }

            }else{
                videoIterator++;
            }
        }else{
            video.pause();
            videoIterator=0;
            return;
        }
        if(videoObj[0].subs[subtitleIterator] && videoObj[0].subs[subtitleIterator].time1 < video.currentTime){
            context.fillStyle = "#f2f2f2";
            context.font = "18px Arial";
            context.textAlign = "center";
            context.fillText(videoObj[0].subs[subtitleIterator].sub_text, canvas.width/2, canvas.height * 0.88);

            if(videoObj[0].subs[subtitleIterator].time2 < video.currentTime) subtitleIterator++;
        }
        if(videoObj[0].effect[effectIterator]){
            effectIterator++;
        }

        //context.drawImage(video,0,0,320,180,0,0,640,360);
        setTimeout(drawVideo,25);
    };

});