'use strict';

require('./lib/polyfills');

var Hammer = require('hammerjs'),
    Leap = require('leapjs'),
    LeapDog = require('./lib/LeapDog');

var hammer = new Hammer(document.querySelectorAll('.js_fryingpan')[0]);
var leapdog = new LeapDog(document.querySelectorAll('.js_leapdog')[0]);

hammer.on('pan', function(e){
    leapdog.pan(e.center);
});

hammer.on('swipe', function(e){
    leapdog.spin(e.velocity);
});

Leap.loop({ enableGestures: true }, function(e){
    if (e.hands.length === 0) {
        return;
    }

    var gestures = e.gestures.filter(function(gesture){
        return gesture.type === 'swipe' && gesture.state === 'stop';
    });

    if (gestures.length > 0) {
        var gesture = gestures[gestures.length - 1];
        leapdog.spin(gesture.speed * Math.abs(gesture.direction[0])/gesture.direction[0]*-1, true);
    } else {
        leapdog.panBy(e.hands[0].palmPosition[0] > 0 ? 2 : -2);
    }
});

leapdog.on('spinEnd', function(){

});
