'use strict';

require('./lib/polyfills');

var Hammer = require('hammerjs'),
    Leap = require('leapjs'),
    normalize = require('./lib/normalize'),
    DogList = require('./lib/doglist'),
    LeapDog = require('./lib/leapdog'),
    Idler = require('./lib/idler');

var dogData = require('../data/dogs.json').map(normalize);

var renderDogList = function() {
    var dogs = new DogList(dogData, {
        el: '.js_doglist',
        itemTemplate: '.tpl_dog'
    });

    dogs.render();
    return dogs;
};

var bindInterface = function(leapdog, dogs) {
    var hammer = new Hammer(document.querySelectorAll('.js_fryingpan')[0]);
    var isPanning = false;

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
        console.log(e.velocity);
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
            leapdog.spin(gesture.speed * Math.abs(gesture.direction[0])/-1*gesture.direction[0], true);
        } else {
            dogs.blurSelected();
            leapdog.panBy(e.hands[0].palmVelocity[0]/100);
        }
    });
};

var getRandomVelocity = function(min, max) {
    min = min || 0.1;
    max = max || 5;
    var direction = Math.random() >= 0.5 ? 1 : -1;
    return (Math.random() * max + min) * direction;
};

var run = function() {
    var leapdog = new LeapDog(document.querySelectorAll('.js_leapdog')[0]);

    var dogs = renderDogList();
    bindInterface(leapdog, dogs);

    var idler = new Idler();

    idler.on('idle', function(){
        leapdog.spin(getRandomVelocity());
    });

    leapdog.on('pan', function(){
        idler.set(false);
    });

    leapdog.on('spin', function(){
        idler.set(false);
        idler.pause();
        dogs.resetSelection();
    });

    leapdog.on('spinEnd', function(e){
        idler.resume();
        // spin under 360deg will break here (but dosen't occure at the moment)
        var deg = e.rotation % 360;
        dogs.select(deg < 0 ? Math.abs(360 + deg) : Math.abs(deg));
    });
};

document.addEventListener('DOMContentLoaded', run);
