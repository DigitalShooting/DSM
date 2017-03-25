var express = require("express");
var compression = require("compression");
var http = require("http");
var lessMiddleware = require("less-middleware");
var config = require("./config/");
var routes = require("./routes");
var proxy = require("express-http-proxy");

var app = express({ strict: true });

app.use(function(req, res, next){
	res.locals.req = req;
	res.locals.config = {
		dscGateway: {
			url: config.dscGateway.url,
			key: config.dscGateway.key,
		},
		dsm: {
			scaleFactor: config.dsm.scaleFactor,
		},
	};
	next();
});

// set up jade
app.set("view engine", "jade");

// route fonts
app.use("/fonts/", express.static("./node_modules/bootstrap/fonts"));

// route js/libs
app.use("/js/", express.static(__dirname + "/assets/js"));
app.use("/libs/", express.static(__dirname + "/assets/libs"));
app.use("/favicon.ico", express.static("./assets/img/favicon.ico"));

// route/render css
app.use("/css/", lessMiddleware(__dirname + "/stylesheets"));
app.use("/css/", express.static(__dirname + "/stylesheets"));

// enable compression
app.use(compression());


// Main routes
app.use("/stammdaten/", routes.stammdaten);
app.use("/lines", routes.lines);
app.use("/stats", routes.stats);
app.use("/dashboard", function(req, res){
	res.render("dashboard");
});

app.use("/exit/", routes.exit);

app.get("/", function(req, res){
	res.render("layout");
});




// start api and map to /api
require("./lib/api/index.js")(function() {
	app.use("/api/", proxy("127.0.0.1:" + config.network.api.port, {
		forwardPath: function(req, res) {
			return require("url").parse(req.url).path;
		}
	}));
});






// Set up express & socket.io
var server = http.Server(app);
require("socket.io")(server); // Only for client script TODO -> bower and remove
server.listen(config.network.webinterface.port, config.network.webinterface.address);
server.on("listening", function() {
	console.log("[INFO] DSM started (%s:%s)", server.address().address, server.address().port);
});
