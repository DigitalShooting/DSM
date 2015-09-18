var express = require("express");
var router = express.Router();
var fs = require("fs")
var path = require("path")
var mysql = require("../../lib/mysql.js")

var itemsPerPage = 30

router.get("/", function(req, res){
	res.redirect("./0")
})

router.get("/:id", function(req, res){
	var selectedPage = parseInt(req.params.id)
	res.locals.selectedPageIndex = selectedPage

	var order = "user.firstName, user.lastName"
	if (req.query.order == "firstName"){
		order = "user.firstName, user.lastName"
	} else if (req.query.order == "lastName"){
		order = "user.lastName, user.firstName"
	} else if (req.query.order == "verein"){
		order = "verein.name"
	} else if (req.query.order == "passnummer"){
		order = "user.passnummer"
	}

	mysql.query(
		"SELECT user.*, verein.name as 'verein' " +
		"FROM user " +
		"LEFT OUTER JOIN verein " +
		"ON user.vereinID = verein.id " +
		"ORDER BY "+order+" DESC " +
		"LIMIT ? OFFSET ?",
		[itemsPerPage, selectedPage*itemsPerPage],
		function(err, rows, fields) {
			res.locals.schuetzen = rows

			mysql.query(
				"SELECT COUNT(*) AS count FROM user;",
				function(err, rows, fields) {

					var pagesCount = Math.ceil(rows[0].count/itemsPerPage)
					res.locals.lastPageIndex = pagesCount

					var pages = []
					for (var i = 4; i > 0; i--){
						if (req.params.id - i >= 0){
							pages.push(req.params.id - i)
						}
					}
					for (var i = 0; i < 5; i++){
						if (selectedPage + i < pagesCount){
							pages.push(selectedPage + i)
						}
					}
					res.locals.pages = pages

					res.render("stammdaten/schuetzen")
				}
			);
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
