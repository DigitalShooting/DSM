/* @flow */

var express = require("express")
var less = require("less")
var compression = require('compression')
var http = require("http")
var bodyParser = require('body-parser')
var expressLess = require('express-less')
var config = require("./config/")
var routes = require("./routes")

var app = express({ strict: true })


app.use(function(req, res, next){
	res.locals.req = req
	next()
})

app.set('view engine', 'jade');

app.use("/fonts/", express.static("./node_modules/bootstrap/fonts"))

app.use("/js/", express.static("./assets/js"))
// app.use("/js/jquery.dataTables.min.js", express.static("./node_modules/datatables/media/js/jquery.dataTables.js"))
// app.use("/js/dataTables.bootstrap.min.js", express.static("./node_modules/datatables/media/js/dataTables.bootstrap.min.js"))
app.use("/js/", express.static("./node_modules/jquery/dist"))

// app.use("/css/jquery.dataTables.min.css", express.static("./node_modules/datatables/media/css/jquery.dataTables.css"))
// app.use("/css/dataTables.bootstrap.css", express.static("./node_modules/datatables/media/css/dataTables.bootstrap.css"))
app.use("/css/", expressLess(__dirname + "/stylesheets"))

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
	res.render(__dirname + "/views/layout.jade")
})


var server = http.Server(app)
server.listen(config.network.port, config.network.address)
server.on('listening', function() {
	console.log('Express server started on at %s:%s', server.address().address, server.address().port)
})
