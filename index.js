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

app.use("/js/", express.static("./assets/js"))
// app.use("/js/jquery.dataTables.min.js", express.static("./node_modules/datatables/media/js/jquery.dataTables.js"))
// app.use("/js/dataTables.bootstrap.min.js", express.static("./node_modules/datatables/media/js/dataTables.bootstrap.min.js"))
app.use("/js/", express.static("./node_modules/jquery/dist"))

// app.use("/css/jquery.dataTables.min.css", express.static("./node_modules/datatables/media/css/jquery.dataTables.css"))
// app.use("/css/dataTables.bootstrap.css", express.static("./node_modules/datatables/media/css/dataTables.bootstrap.css"))
app.use("/css/", lessMiddleware(__dirname + "/stylesheets"))
app.use("/css/", express.static(__dirname + "/stylesheets"))

app.use(bodyParser.urlencoded({
	extended: true
}))

app.use(compression())



app.use("/stammdaten/", routes.stammdaten)
app.use("/rwks/", routes.rwks)

// app.use("/live/", routes.live)
//
// app.use("/manschaften", routes.manschaften);
// app.use("/schuetzen", routes.schützen)
// app.use("/vereine", routes.vereine)
//
app.use("/staende", routes.stände)
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
		var stand = config.stände[id]

		socket.emit('setStatus', {
			stand: stand,
			alive: statusCache[id],
		})
	}

	socket.on('setPower', function(data){
		var stand = config.stände[data.stand]
		if (data.state == true){
			// Power On
			child_process.exec(["wakeonlan", stand.mac], function(err, out, code) { })
		}
		else {
			// Power Off
			child_process.exec(["ssh -t "+stand.user+"@"+stand.ip+" 'sudo shutdown -h now'"], function(err, out, code) { })
		}
	})

})








var stände = []
for(var key in config.stände){
	var stand = config.stände[key]
	stände.push(stand)
}

var statusCache = {}

setInterval(function(){
	stände.forEach(function(stand){
		ping.sys.probe(stand.ip, function(isAlive){
			io.emit('setStatus', {
				stand: stand,
				alive: isAlive,
			})
			statusCache[stand._id] = isAlive
		})
	})
}, 5000)
