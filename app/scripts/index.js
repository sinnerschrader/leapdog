'use strict';

require('./lib/polyfills');

var Hammer = require('hammerjs'),
    Leap = require('leapjs'),
    normalize = require('./lib/normalize'),
    DogList = require('./lib/doglist'),
    LeapDog = require('./lib/leapdog');

var dogData = require('../data/dogs.json').map(normalize);

var run = function() {
    var hammer = new Hammer(document.querySelectorAll('.js_fryingpan')[0]);
    var leapdog = new LeapDog(document.querySelectorAll('.js_leapdog')[0]);

    var dogs = new DogList(dogData, {
        el: '.js_doglist',
        itemTemplate: '.tpl_dog'
    });

    var isPanning = false;

    dogs.render();

    hammer.on('pan', function(e){
        var absAngle = Math.abs(e.angle);
        if (absAngle > 70 && absAngle < 110) {
            leapdog.tilt(e.deltaY*-1/window.innerHeight*90);
        } else {
            leapdog.pan(e.center);
        }
    });

    hammer.on('panstart', function() {
        dogs.blurSelected();
        isPanning = true;
    });

    hammer.on('panend', function() {
        dogs.focusSelected();
        isPanning = false;
    });

    hammer.on('swipe', function(e){
        leapdog.spin(e.velocity);
    });

    Leap.loop({ enableGestures: true }, function(e){
        if (e.hands.length === 0) {
            if (!isPanning) {
                dogs.focusSelected();
            }
            return;
        }

        var gestures = e.gestures.filter(function(gesture){
            return gesture.type === 'swipe' && gesture.state === 'stop';
        });

        if (gestures.length > 0) {
            var gesture = gestures[gestures.length - 1];
            leapdog.spin(gesture.speed * Math.abs(gesture.direction[0])/gesture.direction[0], true);
        } else {
            dogs.blurSelected();
            leapdog.panBy(e.hands[0].palmPosition[0] > 0 ? 2 : -2);
        }
    });

    leapdog.on('spin', dogs.resetSelection);

    leapdog.on('spinEnd', function(e){
        dogs.select(Math.abs(e.rotation) > 360 ? Math.abs(e.rotation % 360) : Math.abs(e.rotation));
    });
};

document.addEventListener('DOMContentLoaded', run);
