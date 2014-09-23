var static = require('node-static'),
    http = require('http');

var tmp = new static.Server('./.tmp');
var app = new static.Server('./app');

http.createServer(function(req, res){
    req.addListener('end', function(){
        if (req.url === '/') {
            app.serveFile('/index.html', 200, {}, req, res);
        } else {
            tmp.serve(req, res);
        }
    }).resume();
}).listen(1337);
