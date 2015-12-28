var restify = require('restify');
var config = require("../config/");
var fs = require('fs');
var mysql = require("../lib/mysql.js")
var routes = require("./routes/")(mysql, config);

var server = restify.createServer({
	name: 'MyApp',
});
server.listen(3000);

server.use(restify.bodyParser({ mapParams: false }));
server.use(restify.queryParser());





// verein
server.get('/verein', routes.verein.get);
server.post('/verein', routes.verein.post);

server.get('/verein/info', routes.verein.info.get);

server.get('/verein/:id', routes.verein.id.get);
server.post('/verein/:id', routes.verein.id.post);
server.del('/verein/:id', routes.verein.id.del);



// user
server.get('/user', routes.user.get);
server.post('/user', routes.user.post);

server.get('/user/info', routes.user.info.get);

server.get('/user/:id', routes.user.id.get);
server.post('/user/:id', routes.user.id.post);
server.del('/user/:id', routes.user.id.del);



// disziplinen
server.get('/disziplinen', routes.disziplinen.get);



// lines
server.get('/lines', routes.lines.get);



// saisons
server.get('/saison', routes.saison.get);
server.post('/saison', routes.saison.post);

server.get('/saison/info', routes.saison.info.get);

server.get('/saison/:id', routes.saison.id.get);
server.post('/saison/:id', routes.saison.id.post);
server.del('/saison/:id', routes.saison.id.del);



// manschaften
server.get('/manschaft', routes.manschaft.get);
server.post('/manschaft', routes.manschaft.post);

server.get('/manschaft/info', routes.manschaft.info.get);

server.get('/manschaft/:id', routes.manschaft.id.get);
server.post('/manschaft/:id', routes.manschaft.id.post);
server.del('/manschaft/:id', routes.manschaft.id.del);



// rwk
server.get('/rwk', routes.rwk.get);
server.post('/rwk', routes.rwk.post);

server.get('/rwk/info', routes.rwk.info.get);

server.get('/rwk/:id', routes.rwk.id.get);
server.post('/rwk/:id', routes.rwk.id.post);
server.del('/rwk/:id', routes.rwk.id.del);
