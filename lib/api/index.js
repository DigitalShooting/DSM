var restify = require("restify");
var config = require("../../config/");
var mysql = require("../mysql.js");
var mongodb = require("../mongodb.js");

module.exports = function(callback) {
	mongodb(function(dbCollection){
		var collection = dbCollection;

		var routes = require("./routes/")(mysql, collection, config);

		var server = restify.createServer({
			name: "DSM-API",
		});
		server.listen(config.network.api.port, config.network.api.address);
		server.on("listening", function() {
			console.log("[INFO] DSM API started (%s:%s)", server.address().address, server.address().port);
		});
		server.use(restify.bodyParser({ mapParams: false }));
		server.use(restify.queryParser());



		// verein
		server.get("/verein", routes.verein.get);
		server.post("/verein", routes.verein.post);

		server.get("/verein/info", routes.verein.info.get);

		server.get("/verein/:vereinID", routes.verein.vereinID.get);
		server.post("/verein/:vereinID", routes.verein.vereinID.post);
		server.del("/verein/:vereinID", routes.verein.vereinID.del);

		server.get("/verein/:vereinID/manschaft", routes.verein.vereinID.manschaft.get);


		// user
		server.get("/user", routes.user.get);
		server.post("/user", routes.user.post);

		server.get("/user/info", routes.user.info.get);

		server.get("/user/:userID", routes.user.userID.get);
		server.post("/user/:userID", routes.user.userID.post);
		server.del("/user/:userID", routes.user.userID.del);



		// disziplinen
		server.get("/disziplinen", routes.disziplinen.get);
		server.get("/disziplinen/:disziplinID", routes.disziplinen.disziplinID.get);



		// lines
		server.get("/lines", routes.lines.get);
		server.get("/lines/:lineID", routes.lines.lineID.get);


		// manschaften
		server.get("/manschaft", routes.manschaft.get);
		server.post("/manschaft", routes.manschaft.post);

		server.get("/manschaft/info", routes.manschaft.info.get);

		server.get("/manschaft/:manschaftID", routes.manschaft.manschaftID.get);
		server.post("/manschaft/:manschaftID", routes.manschaft.manschaftID.post);
		server.del("/manschaft/:manschaftID", routes.manschaft.manschaftID.del);


		// group
		server.get("/group", routes.group.get);

		server.get("/group/info", routes.group.info.get);

		server.get("/group/:groupID", routes.group.groupID.get);
		server.post("/group/:groupID", routes.group.groupID.post);

		server.get("/group/:groupID/sessions", routes.group.groupID.sessions.get);
		server.get("/group/:groupID/sessions/:sessionID", routes.group.groupID.sessions.sessionID.get);



		// sessions
		server.get("/sessions", routes.sessions.get);

		server.get("/sessions/info", routes.sessions.info.get);



		callback();
	});
};
