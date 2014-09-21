'use strict';

require('./lib/polyfills');

var Hammer = require('hammerjs'),
    LeapDog = require('./lib/LeapDog');

var hammer = new Hammer(document.querySelectorAll('.js_fryingpan')[0]);
var leapdog = new LeapDog(document.querySelectorAll('.js_leapdog')[0]);

hammer.on('pan', function(e){
    leapdog.pan(e.center);
});

hammer.on('swipe', function(e){
    leapdog.spin(e.velocity);
});
