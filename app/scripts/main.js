"use strict";

var $gestures = $(".gestures"),
    $pos = $(".position"),
    $wheel = $(".wheel"),
    turning = false;

Leap.loop({enableGestures: true}, function(frame){
    if (frame.hands[0] && !turning && false) {
        var x = frame.hands[0].palmPosition[0];
        var z = frame.hands[0].palmPosition[2];
        var maxZ = 10;
        z = Math.min(Math.max(z, -maxZ), maxZ*2);
        $pos.text(z);
        $wheel.css({"-webkit-transform":"rotateX("+-z+"deg) rotateZ("+x/2+"deg)"});
    }

    $gestures.text("");
    if (frame.gestures.length > 0 && !turning) {
        
        var gesture = frame.gestures.filter(function(gesture, i) {
            return (gesture.type == "swipe" && gesture.state == "stop");
        })
        .reduce(function(prev, current, i) {
            if (prev == null) return current;
            return (Math.abs(prev.direction[0]) > Math.abs(current.direction[0]) ? prev : current);
        }, null)

        if (gesture != null) {
            turning = true;
            console.log(gesture.direction[0]);
            var rotation = gesture.direction[0]*360,
                duration = Math.abs(gesture.direction[0])*3;
            $wheel.css({
                "-webkit-transform":"rotateZ("+rotation+"deg)",
                "-webkit-transition-duration":""+duration+"s"});
            $gestures.append(gesture.type + " ");
        }
    }
});

$wheel.on("webkitTransitionEnd", function(event) {
    console.log("end");
    turning = false;
});
