"use strict";

var $gestures = $(".gestures"),
    $pos = $(".position"),
    $wheel = $(".wheel");

Leap.loop({enableGestures: true}, function(frame){
    if (frame.hands[0]) {
        var x = frame.hands[0].palmPosition[0];
        $pos.text(x);
        $wheel.css({"-webkit-transform":"rotate("+x/2+"deg)"});
    }

    $gestures.text("");
    $.each(frame.gestures, function(i, gesture) {
        $gestures.append(gesture.type + " ");
    });
});
