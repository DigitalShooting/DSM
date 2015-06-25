var express = require("express");
var router = express.Router();
var fs = require("fs")
var path = require("path")
var connection = require("../../lib/connection")
var async = require("async")



router.get("/", function(req, res){
	connection.query(
		"SELECT saisons.*, disziplinen.name as 'disziplin' " +
		"FROM saisons " +
		"LEFT OUTER JOIN disziplinen " +
		"ON saisons.disziplinID = disziplinen.id ",
		function(err, saisons){
			if (err){
				console.error(err)
			}
			res.locals.saisons = saisons
			res.render("rwks/saisons")
		}
	)
})




router.get("/edit/*", function(req, res, next){
	async.parallel(
		{
			disziplinen: function(callback) {
				connection.query(
					"SELECT * " +
					"FROM disziplinen ",
					function(err, disziplinen){
						if (err){
							console.error(err)
						}
						callback(null, disziplinen)
					}
				)
			}
		},
		function(err, results) {
			res.locals.disziplinen = results.disziplinen
			next()
		}
	)
})

router.get("/edit/new", function(req, res){
	res.render("rwks/saisons/edit/new")
})

router.post("/edit/new", function(req, res){
	connection.query(
		"INSERT INTO saisons (jahr, disziplinID) " +
		"VALUES (?, ?) ",
		[req.body.jahr, req.body.disziplin],
		function(err){
			if (err){
				console.error(err)
			}
			res.redirect("../")
		}
	)
})


router.get("/edit/:id", function(req, res){
	connection.query(
		"SELECT * " +
		"FROM saisons " +
		"WHERE id = ? ",
		[req.params.id],
		function(err, saisons){
			if (err){
				console.error(err)
			}
			if(saisons.length >= 1){
				res.locals.saison = saisons[0]
				res.render("rwks/saisons/edit")
			} else {
				res.redirect("../")
			}
		}
	)
})

router.post("/edit/:id", function(req, res){
	connection.query(
		"UPDATE saisons " +
		"SET jahr = ?, disziplinID = ? " +
		"WHERE id = ? ",
		[req.body.jahr, req.body.disziplin, req.params.id],
		function(err){
			if (err){
				console.error(err)
			}
			res.redirect("../")
		}
	)
})






router.get("/delete/:id", function(req, res){
	connection.query(
		"DELETE FROM saisons " +
		"WHERE id = ? ",
		[req.params.id],
		function(err){
			if (err){
				console.error(err)
			}
			res.redirect("../")

		}
	)
})






module.exports = router
