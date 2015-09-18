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

	var order = "verein.name"
	mysql.query(
		"SELECT * " +
		"FROM verein " +
		"ORDER BY "+order+" DESC " +
		"LIMIT ? OFFSET ?",
		[itemsPerPage, selectedPage*itemsPerPage],
		function(err, rows, fields) {
			res.locals.vereine = rows

			mysql.query(
				"SELECT COUNT(*) AS count FROM verein;",
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

					res.render("stammdaten/vereine")
				}
			)
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
