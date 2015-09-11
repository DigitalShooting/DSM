var express = require("express");
var router = express.Router();
var fs = require("fs")
var path = require("path")
var mysql = require("../../lib/mysql.js")


router.get("/", function(req, res){
	mysql.query(
		"SELECT * " +
		"FROM verein ",
		function(err, rows, fields) {
			res.locals.vereine = rows
			res.render("stammdaten/vereine")
		}
	);
})


router.get("/edit/new", function(req, res){
	mysql.query(
		"INSERT INTO verein () " +
		"VALUES () ",
		function(err, result){
			res.redirect(result.insertId)
		}
	)
})


router.get("/edit/:id", function(req, res){
	mysql.query(
		"SELECT * " +
		"FROM verein " +
		"WHERE verein.id = ?",
		[req.params.id],
		function(err, rows, fields) {
			if(rows.length > 0){
				res.locals.verein = rows[0]
				res.render("stammdaten/vereine/edit")
			}
			else {
				res.redirect("../")
			}
		}
	);
})

router.post("/edit/:id", function(req, res){
	mysql.query(
		"UPDATE verein " +
		"SET name = ?, note = ?" +
		"WHERE id = ? ",
		[req.body.name, req.body.note, req.params.id],
		function(err, rows, fields) {
			res.redirect("../")
		}
	);
})



router.get("/delete/:id", function(req, res){
	mysql.query(
		"DELETE FROM verein " +
		"WHERE id = ? ",
		[req.params.id],
		function(err){
			res.redirect("../")
		}
	)
})



module.exports = router
