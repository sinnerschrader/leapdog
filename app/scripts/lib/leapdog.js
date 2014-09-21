Victor = require('victor');
EventEmitter = require('events').EventEmitter;

class LeapDog extends EventEmitter {
    constructor(el, options) {
        var defaults = {
            els: {
                spin: '.js_needle'
            },
            drag: 0.1,
            speed: 25,
            velocity: {
                max: 6
            }
        };

        this.options = {};
        Object.assign(this.options, defaults, options);

        this.el = el;
        this.rotation = 0;
        this.velocity = 0;
        this.changed = false;
        this.blocked = false;

        this.spinEl = this.el.querySelectorAll(this.options.els.spin)[0];

        this.center = this.getCenter();
        this.vectorOrigin = Victor.fromObject(this.center);

        this.animationFrame = (timeStamp) => {
            if (this.spinEl && this.changed) {
                this.spinEl.style.transform = 'rotateZ('+this.rotation+'deg)';
                this.changed = false;
            }
            window.requestAnimationFrame(this.animationFrame);
        }

        this.modifierFrame = (timeStamp) => {
            if (Math.abs(this.velocity) > 0.1) {
                this.decelerate(this.getDrag(this.velocity));
                this.rotateBy(this.velocity * this.options.speed);
            } else if (this.velocity !== 0) {
                this.velocity = 0;
                this.blocked = false;
                this.emit('spinEnd', {
                    rotation: this.rotation
                });
            }
            window.requestAnimationFrame(this.modifierFrame);
        }

        this.animationFrame();
        this.modifierFrame();
    }

    accelerate(delta) {
        this.velocity += (Math.abs(this.velocity)/this.velocity)*delta;
    }

    decelerate(delta) {
        this.velocity += (Math.abs(this.velocity)/this.velocity*-1)*delta;
    }

    setVelocity(velocity) {
        this.velocity += velocity;
        this.velocity = Math.min(Math.abs(this.velocity), this.options.velocity.max)*Math.abs(velocity)/velocity;
    }

    resetVelocity() {
        this.velocity = 0;
    }

    getDrag(velocity) {
        return (velocity*velocity)/2 * this.options.drag;
    }

    getCenter() {
        var rect = this.el.getBoundingClientRect();

        return {
            x: rect.left + this.el.clientWidth / 2,
            y: rect.top + this.el.clientHeight / 2
        };
    }

    pan(coords) {
        this.emit('pan');
        if (this.blocked) {
            return;
        }
        var vec = Victor.fromObject(coords).subtract(this.vectorOrigin);
        this.rotate(vec.angleDeg());
    }

    panBy(offset) {
        this.emit('panBy');
        this.rotate(this.rotation + offset);
    }

    spin(velocity, blocking) {
        this.emit('spin');
        if (this.blocked) {
            return;
        }
        this.setVelocity(velocity*-1);
        this.blocked = this.blocking || false;
    }

    rotate(deg) {
        this.changed = true;
        this.rotation = deg;
    }

    rotateBy(deg) {
        this.rotate(this.rotation + deg);
    }
}

module.exports = LeapDog;
