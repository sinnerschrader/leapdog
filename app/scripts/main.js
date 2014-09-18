var $gestures = $(".gestures"),
    $pos = $(".position");

var controller = new Leap.Controller({enableGestures: true})
.connect()
.on('frame', function(frame){
    if (frame.hands[0]) {
        $pos.text(frame.hands[0].palmPosition[0]);
    }
    $gestures.text("");
    $.each(frame.gestures, function(i, gesture) {
        $gestures.append(gesture.type);
    });
})
