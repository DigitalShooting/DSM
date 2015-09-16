var express = require("express");
var router = express.Router();
var fs = require("fs")
var path = require("path")
var config = require("../../config/")
var mysql = require("../../lib/mysql.js")

router.use("/", function(req, res, next){
	res.locals.config = {
		lines: config.lines,
	}

	mysql.query(
		"SELECT * " +
		"FROM verein ",
		function(err, rows, fields) {
			res.locals.vereine = rows


			mysql.query(
				"SELECT * " +
				"FROM user ",
				function(err, rows, fields) {
					res.locals.schuetzen = rows
					next()
				}
			);

		}
	);
})

router.get("/", function(req, res){
	res.render("lines/index")
})


module.exports = router
