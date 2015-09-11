var config = require("../config/")
var mysql = require('mysql')
var connection = mysql.createConnection(config.database.mysql);
connection.connect();

module.exports = connection
