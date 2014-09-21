var objectAssign = require('object-assign');

module.exports = (function(){
    Object.assign = Object.assign || objectAssign;
})();
