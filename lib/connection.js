// Set up SQL connection
var config = require("../config.js").database
config.multipleStatements = true

var mysql = require("mysql")
var connection = mysql.createConnection(config)

connection.connect(function(err){
	if (err){
		console.error('Database connection error: ' + err.stack)
		throw err
	} else {
		console.info("Database connected.")
	}
})

module.exports = connection;
