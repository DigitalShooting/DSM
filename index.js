var express = require("express")
var less = require("less")
var compression = require('compression')
var http = require("http")
var bodyParser = require('body-parser')
var lessMiddleware = require('less-middleware')
var config = require("./config/")
var routes = require("./routes")
var exec = require("exec")
var child_process = require('child_process')




var app = express({ strict: true })

app.use(function(req, res, next){
	res.locals.req = req
	next()
})

// set up jade
app.set('view engine', 'jade');

// route fonts
app.use("/fonts/", express.static("./node_modules/bootstrap/fonts"))

// route js/libs
app.use("/js/", express.static(__dirname + "/assets/js"))
app.use("/libs/", express.static(__dirname + "/assets/libs"))
app.use("/favicon.ico", express.static("./assets/img/favicon.ico"))

// route/render css
app.use("/css/", lessMiddleware(__dirname + "/stylesheets"))
app.use("/css/", express.static(__dirname + "/stylesheets"))

// enable forms
app.use(bodyParser.urlencoded({
	extended: true
}))

// enable compression
app.use(compression())




// Main routes
app.use("/stammdaten/", routes.stammdaten)
app.use("/rwks/", routes.rwks)
app.use("/lines", routes.lines)

app.use("/exit/", routes.exit)

app.get("/", function(req, res){
	res.redirect("lines/")
})




// Set up express & socket.io
var server = http.Server(app)
var io = require('socket.io')(server)
server.listen(config.network.port, config.network.address)
server.on('listening', function() {
	console.log('Express server started on at %s:%s', server.address().address, server.address().port)
})




// socket.io
io.on('connection', function(socket){

	// set power performs wakeonlan or ssh shutdown on target machine
	socket.on('setPower', function(data){
		var line = config.lines[data.line]
		if (data.state == true){
			// Power On
			exec(["wakeonlan", line.mac], function(err, out, code) { })
		}
		else {
			// Power Off
			child_process.exec(["ssh -t "+line.user+"@"+line.ip+" 'sudo shutdown -h now'"], function(err, out, code) { })
		}
	})
})
