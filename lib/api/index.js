var restify = require('restify');
var config = require("../../config/");
var fs = require('fs');
var mysql = require("../mysql.js")
var routes = require("./routes/")(mysql, config);

var server = restify.createServer({
	name: 'DSM-API',
});
server.listen(config.network.api.port, config.network.api.address);

server.use(restify.bodyParser({ mapParams: false }));
server.use(restify.queryParser());





// verein
server.get('/verein', routes.verein.get);
server.post('/verein', routes.verein.post);

server.get('/verein/info', routes.verein.info.get);

server.get('/verein/:vereinID', routes.verein.vereinID.get);
server.post('/verein/:vereinID', routes.verein.vereinID.post);
server.del('/verein/:vereinID', routes.verein.vereinID.del);



// user
server.get('/user', routes.user.get);
server.post('/user', routes.user.post);

server.get('/user/info', routes.user.info.get);

server.get('/user/:userID', routes.user.userID.get);
server.post('/user/:userID', routes.user.userID.post);
server.del('/user/:userID', routes.user.userID.del);



// disziplinen
server.get('/disziplinen', routes.disziplinen.get);



// lines
server.get('/lines', routes.lines.get);



// saisons
server.get('/saison', routes.saison.get);
server.post('/saison', routes.saison.post);

server.get('/saison/info', routes.saison.info.get);

server.get('/saison/:saisonID', routes.saison.saisonID.get);
server.post('/saison/:saisonID', routes.saison.saisonID.post);
server.del('/saison/:saisonID', routes.saison.saisonID.del);



// manschaften
server.get('/manschaft', routes.manschaft.get);
server.post('/manschaft', routes.manschaft.post);

server.get('/manschaft/info', routes.manschaft.info.get);

server.get('/manschaft/:manschaftID', routes.manschaft.manschaftID.get);
server.post('/manschaft/:manschaftID', routes.manschaft.manschaftID.post);
server.del('/manschaft/:manschaftID', routes.manschaft.manschaftID.del);

server.get('/manschaft/:manschaftID/member', routes.manschaft.manschaftID.member.get);
server.post('/manschaft/:manschaftID/member', routes.manschaft.manschaftID.member.post);

server.get('/manschaft/:manschaftID/member/:memberID', routes.manschaft.manschaftID.member.memberID.get);
server.post('/manschaft/:manschaftID/member/:memberID', routes.manschaft.manschaftID.member.memberID.post);
server.del('/manschaft/:manschaftID/member/:memberID', routes.manschaft.manschaftID.member.memberID.del);



// rwk
server.get('/rwk', routes.rwk.get);
server.post('/rwk', routes.rwk.post);

server.get('/rwk/info', routes.rwk.info.get);

server.get('/rwk/:rwkID', routes.rwk.rwkID.get);
server.post('/rwk/:rwkID', routes.rwk.rwkID.post);
server.del('/rwk/:rwkID', routes.rwk.rwkID.del);

server.get('/rwk/:rwkID/member', routes.rwk.rwkID.member.get);
server.post('/rwk/:rwkID/member', routes.rwk.rwkID.member.post);

server.get('/rwk/:rwkID/member/:shotInID', routes.rwk.rwkID.member.shotInID.get);
server.post('/rwk/:rwkID/member/:shotInID', routes.rwk.rwkID.member.shotInID.post);
server.del('/rwk/:rwkID/member/:shotInID', routes.rwk.rwkID.member.shotInID.del);





// group
server.get('/group', routes.group.get);
// server.post('/group', routes.group.post);

server.get('/group/info', routes.group.info.get);

server.get('/group/:groupID', routes.group.groupID.get);
server.post('/group/:groupID', routes.group.groupID.post);
// server.del('/group/:groupID', routes.group.groupID.del);

server.get('/group/:groupID/sessions', routes.group.groupID.sessions.get);
server.get('/group/:groupID/sessions/:sessionID', routes.group.groupID.sessions.sessionID.get);
// server.get('/group/:groupID/sessions/:sessionID/shots', routes.group.groupID.sessions.sessionID.shots.get);




module.exports = server;
