/* @flow */

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
var ping = require('ping')

var app = express({ strict: true })


app.use(function(req, res, next){
	res.locals.req = req
	next()
})

app.set('view engine', 'jade');

app.use("/fonts/", express.static("./node_modules/bootstrap/fonts"))

app.use("/js/socket.io.js", express.static("./node_modules/socket.io/node_modules/socket.io-client/socket.io.js"))

app.use("/js/", express.static(__dirname + "/assets/js"))
app.use("/libs/", express.static(__dirname + "/assets/libs"))
app.use("/js/", express.static(__dirname + "/node_modules/jquery/dist"))

app.use("/css/", lessMiddleware(__dirname + "/stylesheets"))
app.use("/css/", express.static(__dirname + "/stylesheets"))

app.use(bodyParser.urlencoded({
	extended: true
}))

app.use(compression())



app.use("/stammdaten/", routes.stammdaten)
app.use("/rwks/", routes.rwks)
app.use("/exit/", routes.exit)

// app.use("/live/", routes.live)
//
// app.use("/manschaften", routes.manschaften);
// app.use("/schuetzen", routes.schützen)
// app.use("/vereine", routes.vereine)
//
app.use("/lines", routes.lines)
// app.use("/auswertung", routes.auswertung)




app.get("/", function(req, res){
	res.render("index.jade")
})


var server = http.Server(app)
var io = require('socket.io')(server)
server.listen(config.network.port, config.network.address)
server.on('listening', function() {
	console.log('Express server started on at %s:%s', server.address().address, server.address().port)
})






io.on('connection', function(socket){

	for(var id in statusCache){
		var line = config.lines[id]

		socket.emit('setStatus', {
			line: line,
			alive: statusCache[id],
		})
	}

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








var lines = []
for(var key in config.lines){
	var line = config.lines[key]
	lines.push(line)
}

var statusCache = {}

setInterval(function(){
	lines.forEach(function(line){
		ping.sys.probe(line.ip, function(isAlive){
			io.emit('setStatus', {
				line: line,
				alive: isAlive,
			})
			statusCache[line._id] = isAlive
		})
	})
}, 5000)
