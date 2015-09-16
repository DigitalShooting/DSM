var express = require("express");
var router = express.Router();
var fs = require("fs")
var path = require("path")
var mysql = require("../../lib/mysql.js")



router.get("/", function(req, res){
	mysql.query(
		"SELECT user.*, verein.name as 'verein' " +
		"FROM user " +
		"LEFT OUTER JOIN verein " +
		"ON user.vereinID = verein.id",
		function(err, rows, fields) {
			res.locals.schuetzen = rows
			res.render("stammdaten/schuetzen")
		}
	);
})



router.get("/edit/*", function(req, res, next){
	mysql.query(
		"SELECT * " +
		"FROM verein ",
		function(err, rows, fields) {
			res.locals.vereine = rows
			next()
		}
	);
})

router.get("/edit/new", function(req, res){
	mysql.query(
		"INSERT INTO user () " +
		"VALUES () ",
		function(err, result){
			res.redirect(result.insertId)
		}
	)
})

router.get("/edit/:id", function(req, res){
	mysql.query(
		"SELECT user.*, verein.name as 'verein' " +
		"FROM user " +
		"LEFT OUTER JOIN verein " +
		"ON user.vereinID = verein.id "+
		"WHERE user.id = ?",
		[req.params.id],
		function(err, rows, fields) {
			if(rows.length > 0){
				res.locals.schuetze = rows[0]
				res.render("stammdaten/schuetzen/edit")
			}
			else {
				res.redirect("../")
			}
		}
	);
})

router.post("/edit/:id", function(req, res){
	mysql.query(
		"UPDATE user " +
		"SET firstName = ?, lastName = ?, passnummer = ?, vereinID = ?, note = ?" +
		"WHERE id = ? ",
		[req.body.firstName, req.body.lastName, req.body.passnummer, req.body.vereinID, req.body.note, req.params.id],
		function(err, rows, fields) {
			res.redirect("../")
		}
	);
})



router.get("/delete/:id", function(req, res){
	mysql.query(
		"DELETE FROM user " +
		"WHERE id = ? ",
		[req.params.id],
		function(err){
			res.redirect("../")
		}
	)
})



module.exports = router
