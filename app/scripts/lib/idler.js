EventEmitter = require('events').EventEmitter;

class Idler extends EventEmitter {
    constructor(options) {
        var defaults = {
            timeout: 20 * 1000,
            inital: false
        };

        this.options = Object.assign({}, defaults, options);
        this.idle = this.options.inital;
        this.paued = false;

        setInterval(() => { this.idleLoop() }, this.options.timeout);

        if (this.options.inital) {
            this.idleLoop();
        }
    }

    set(value) {
        this.idle = value || false;
    }

    pause() {
        this.paused = true;
    }

    resume() {
        this.paused = false;
    }

    idleLoop() {
        if (this.idle && ! this.paused) {
            this.emit('idle');
        }
        if (! this.paused) {
            this.set(true);
        }
    }
}

module.exports = Idler;
