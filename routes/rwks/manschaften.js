var express = require("express");
var router = express.Router();
var fs = require("fs")
var path = require("path")
var connection = require("../../lib/connection")
var async = require("async")



router.get("/", function(req, res){
	connection.query(
		"SELECT manschaften.*, vereine.name as 'verein', saisons.jahr as 'saison' " +
		"FROM manschaften " +
		"LEFT OUTER JOIN vereine " +
		"ON manschaften.vereinID = vereine.id " +
		"LEFT OUTER JOIN saisons " +
		"ON manschaften.saisonID = saisons.id ",
		function(err, manschaften){
			if (err){
				console.error(err)
			}
			res.locals.manschaften = manschaften
			res.render("rwks/manschaften")
		}
	)
})




router.get("/edit/*", function(req, res, next){
	async.parallel(
		{
			vereine: function(callback) {
				connection.query(
					"SELECT * " +
					"FROM vereine ",
					function(err, vereine){
						if (err){
							console.error(err)
						}
						callback(null, vereine)
					}
				)
			},
			saisons: function(callback) {
				connection.query(
					"SELECT saisons.*, disziplinen.name as 'disziplin' " +
					"FROM saisons " +
					"LEFT OUTER JOIN disziplinen " +
					"ON saisons.disziplinID = disziplinen.id ",
					function(err, saisons){
						if (err){
							console.error(err)
						}
						callback(null, saisons)
					}
				)
			}
		},
		function(err, results) {
			res.locals.vereine = results.vereine
			res.locals.saisons = results.saisons
			next()
		}
	)
})

router.get("/edit/new", function(req, res){
	res.render("rwks/manschaften/edit/new")
})

router.post("/edit/new", function(req, res){
	connection.query(
		"INSERT INTO manschaften (name, vereinID, saisonID) " +
		"VALUES (?, ?, ?) ",
		[req.body.name, req.body.verein, req.body.saison],
		function(err, plugins){
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
		"FROM manschaften " +
		"WHERE id = ? ",
		[req.params.id],
		function(err, manschaften){
			if (err){
				console.error(err)
			}
			if(manschaften.length >= 1){
				res.locals.manschaft = manschaften[0]
				res.render("rwks/manschaften/edit")
			} else {
				res.redirect("../")
			}
		}
	)
})

router.post("/edit/:id", function(req, res){
	connection.query(
		"UPDATE manschaften " +
		"SET name = ?, vereinID = ?, saisonID = ? " +
		"WHERE id = ? ",
		[req.body.name, req.body.verein, req.body.saison, req.params.id],
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
		"DELETE FROM manschaften " +
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
