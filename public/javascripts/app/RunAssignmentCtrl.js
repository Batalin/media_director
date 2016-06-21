angular.module('app').controller('RunAssignmentCtrl', function($scope, $routeParams, Identity, Assignment, $timeout) {
    if (Identity.currentUser) {
        $scope.user_id = Identity.currentUser._id;
    }
    $scope.assignment_id = $routeParams.id.substr($routeParams.id.indexOf('__')+2);
    $scope.assignment_title = $routeParams.id.substr(0,$routeParams.id.indexOf('__'));
    $scope.sub_duration = 3;
    $scope.duration_buttons = [true, false, false];
    $scope.finished = false;
    $scope.result_video_route = "";

    $scope.previewButtons = [false, false, false, false];
    $scope.recordButtons = [false, false, false, false];

    $scope.play_pause = "Record";
    $scope.newSub = "";
    $scope.selectedSub = "";

    var v_width = Number($routeParams.resolution),
        v_height;

    if(v_width == 320) {
      v_height = 180;
    } else if(v_width == 480) {
      v_height = 270;
    }

    console.log(v_width + ' ' + v_height);

    var isPlayed = false;
    var firstDraw = true;
    var record_sub_bool = false, preview_sub_bool = false;

    var totalTime, hours, minutes, seconds;


    var video = document.getElementById("video"),
        canvasPre = document.getElementById("canvasPreview"),
        canvasRec = document.getElementById("canvasRecord"),
        canvasVideo = document.getElementById("canvasVideo"),
        timeCanvas = document.getElementById("canvasTime");
    var contextPre = canvasPre.getContext("2d"),
        contextRec = canvasRec.getContext("2d"),
        contextVideo = canvasVideo.getContext("2d"),
        timeContext = timeCanvas.getContext("2d");
    var preCamera = 1,
        recCamera = 1;
    var TimeArray = [],
        SubtArray = [],
        EffectArray = [];
    var labelPre = "P R E V I E W";
    var labelRec = "R E C O R D";
    var labels=["CAMERA 1", "CAMERA 2", "CAMERA 3", "CAMERA 4"];

    $timeout(function(){
      drawCanvas();
    });

    video.addEventListener("play", drawCanvas);


    $scope.playVideo = function() {
        isPlayed = !isPlayed;
        $scope.play_pause = isPlayed ? 'Pause ' : 'Record';
        if(isPlayed){
            video.play();
        }else{
            video.pause();
        }
    }


    $scope.set_sub_duration = function(x) {
      $scope.duration_buttons = [false, false, false];
      $scope.duration_buttons[x] = true;
      $scope.sub_duration = $scope.duration_buttons[0] * 3 + $scope.duration_buttons[1] * 5 + $scope.duration_buttons[2] * 7;
    }

    $scope.preview = function(camera) {
        preCamera = camera;
        if(video.paused) contextPre.drawImage(video,(preCamera-1)*v_width,0,v_width,v_height,0,0,640,360);
        clearPreviewButtons();
        $scope.previewButtons[camera-1] = true;
    }

    $scope.record = function() {
        var start = video.currentTime;
        var e = new Event();
        e.camera = recCamera;
        e.time1 = start;
        TimeArray[TimeArray.length-1].time2 = start;
        TimeArray.push(e);
    }

    $scope.finish = function() {
        TimeArray[TimeArray.length-1].time2 = video.currentTime;
        sendToServer();
        video.pause();
        video.currentTime = 0;
    }

    $scope.restart = function() {
        $scope.playVideo();
        video.currentTime = 0;
        drawCanvas();
    }

    $scope.take = function() {
        recCamera = preCamera;
        if(TimeArray.length == 0) {
            var first = new Event();
            first.camera = recCamera;
            TimeArray.push(first);
        }
        if(!video.paused && !video.ended) {
            $scope.record();
        }
        contextRec.drawImage(video,(recCamera-1)*v_width,0,v_width,v_height,0,0,640,360);
        TimeArray[TimeArray.length-1].camera = recCamera;
        clearRecordButtons();
        $scope.recordButtons[recCamera-1] = true;
    }

    $scope.mute = function() {
        video.muted = !video.muted;
        $scope.muted = video.muted;
    }

    function drawCanvas() {
      if (!video.paused && !video.ended || firstDraw) {
        contextPre.drawImage(video, (preCamera - 1)*v_width,0,v_width,v_height,0,0,640,360);
        contextRec.drawImage(video, (recCamera - 1)*v_width,0,v_width,v_height,0,0,640,360);
        contextVideo.drawImage(video, 0, 0, 1280, 180);
        firstDraw = false;
      }

      var opacity = 0.3;

      contextVideo.fillStyle = "rgba(0,0,0," + opacity + ")";
      contextVideo.fillRect(0, 180 * 0.9, 1280, 0.1 * 180);
      contextVideo.fillStyle = "#f2f2f2";
      contextVideo.font = "lighter 12px Arial";
      contextVideo.textAlign = "center";

      for(var i=0; i < 4; i++){
        contextVideo.fillText(labels[i], (0.5+i)*320, 180 * 0.98);
      }

      contextPre.fillStyle = "rgba(0,0,0," + opacity + ")";
      contextPre.fillRect(0, 180 * 2 * 0.9, 320 *2, 180 * 0.1 * 2);
      contextPre.fillStyle = "#f2f2f2";
      contextPre.font = "14px Arial";
      contextPre.textAlign = "center";
      contextPre.fillText(labelPre, 320, 180 * 1.96);
      contextRec.fillStyle = "rgba(0,0,0," + opacity + ")";
      contextRec.fillRect(0, 180 * 2 * 0.9, 320 *2, 180 * 0.1 * 2);
      contextRec.fillStyle = "#f2f2f2";
      contextRec.font = "14px Arial";
      contextRec.textAlign = "center";
      contextRec.fillText(labelRec, 320, 180 * 1.96);

      if(preview_sub_bool) {
        contextPre.fillStyle = "#f2f2f2";
        contextPre.font = "22px Arial";
        contextPre.textAlign = "center";
        contextPre.fillText($scope.selectedSub, 320, 180 * 1.75);
      }
      if(record_sub_bool) {
        contextRec.fillStyle = "#f2f2f2";
        contextRec.font = "22px Arial";
        contextRec.textAlign = "center";
        contextRec.fillText(SubtArray[SubtArray.length-1].sub_text, 320, 180 * 1.75);
        if(video.currentTime > SubtArray[SubtArray.length-1].time2) record_sub_bool = false;
      }
      timeContext.fillStyle="#f2f2f2";
      timeContext.font="64px Arial";
      timeContext.clearRect(0,0,timeCanvas.width,timeCanvas.height);
      if(video.currentTime == 0){
        hours = 0;
        minutes = 0;
        seconds = 0;
      }else{
        totalTime = video.duration - video.currentTime;
        hours = Math.floor(totalTime/3600);
        minutes = Math.floor((totalTime - hours*3600)/60);
        seconds = Math.round(totalTime - hours*3600 - minutes*60);
      }
      timeContext.fillText(n(hours) + ":" + n(minutes) + ":" + n(seconds),10,100);
      if (video.paused || video.ended) return;
        setTimeout(drawCanvas,23);
    }

    function n(n){
        return n > 9 ? "" + n : "0" + n;
    }

    function clearPreviewButtons() {
        for(var i=0; i<$scope.previewButtons.length;i++) {
            $scope.previewButtons[i] = false;
        }
    }

    function clearRecordButtons() {
        for(var i=0; i<$scope.recordButtons.length;i++) {
            $scope.recordButtons[i] = false;
        }
    }

    document.addEventListener("keydown", function(event) {
        if(event.keyCode == 49) {
            $scope.$apply($scope.preview(1));
        }else if(event.keyCode == 50) {
            $scope.$apply($scope.preview(2));
        }else if(event.keyCode == 51) {
            $scope.$apply($scope.preview(3));
        }else if(event.keyCode == 52) {
            $scope.$apply($scope.preview(4))
        }else if(event.keyCode == 13){
            event.preventDefault();
            $scope.$apply($scope.take());
        }
    });


    $scope.preview_subtitle = function() {
      if($scope.selectedSub.length > 0){
        preview_sub_bool = !preview_sub_bool;
      }
    }

    $scope.record_subtitle = function() {
      var newSub = new SubtitleEvent();
      newSub.time1  = video.currentTime;
      newSub.time2 = newSub.time1 + $scope.sub_duration;
      newSub.sub_text = $scope.selectedSub;
      SubtArray.push(newSub);
      record_sub_bool = true;
      preview_sub_bool = false;
    }

    function sendToServer(){
        var obj_to_send = {
            user: $scope.user_id,
            assignment: $scope.assignment_id,
            created: new Date(),
            duration: video.currentTime,
            cut: TimeArray,
            subs: SubtArray,
            effect: EffectArray
        };
        console.log("Time Array: " + JSON.stringify(obj_to_send));
        $.ajax({
            type: 'POST',
            data: JSON.stringify(obj_to_send),
            contentType: 'application/json',
            url: '/api/videos',
            success: function(data) {
                document.getElementById("final").style.visibility="visible";
                $("#finalButton").attr("href", "/videos/" + $scope.assignment_title + $scope.assignment_id + "__" + data);
            }
        });
    }


    function Event(t1, t2, camera) {
        if(this.time1) this.time1 = t1;
        else this.time1 = 0;
        if(this.time2) this.time2 = t2;
        else this.time2 = 0;
        if(this.camera) this.camera = camera;
        else this.camera = 1;
        this.final = false;
    }

    Event.prototype = {
        time1: 0,
        time2: 0,
        camera: 1,
        final: false,
        setCamera: function(camera) {
            this.camera = camera;
        },
        end: function(time) {
            this.time2 = time;
        },
        start: function(start_time) {
            this.time1 = start_time;
        }
    }


    function SubtitleEvent() {
        this.sub_text = "";
    }
    SubtitleEvent.prototype = new Event();

});


angular.module('app').directive("addsubtitlesinput", function(){
  return {
    restrict: "E",
    template: "<input ng-model='newSub' class='form-control' placeholder='Type in new subtitle'/><span class='input-group-btn'><button addsubt class='btn btn-default'>Add</button></span>"
  }
});

//Directive for adding buttons on click that contain subtitle
angular.module('app').directive("addsubt", function($compile){
  return function($scope, $element, $attrs){
    $element.bind("click", function(){
      //$scope.count++;
      angular.element(document.getElementById('subtitle_box')).append($compile("<div><button class='btn btn-default' data-selectsub="+$scope.newSub.split(' ').join('_')+">"+$scope.newSub+"</button><button class='btn btn-default' data-deletesub>X</button></div>")($scope));
    });
  };
});

//Directive for selecting subtitle
angular.module('app').directive("selectsub", function(){
  return function($scope, $element, $attrs){
    $element.bind("click", function(){
      $scope.selectedSub = $attrs.selectsub.split('_').join(' ');
    });
  };
});

//Directive for remove subtitle action
angular.module('app').directive("deletesub", function() {
  return function($scope, $element) {
    $element.bind("click", function() {
      if($scope.selectedSub == $(this).parent().find('button')[0].innerText){
        $scope.selectedSub = "";
      }
      $(this).parent().remove();
    });
  }
});
