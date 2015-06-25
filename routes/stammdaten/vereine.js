var express = require("express");
var router = express.Router();
var fs = require("fs")
var path = require("path")
var connection = require("../../lib/connection")



router.get("/", function(req, res){
	connection.query(
		"SELECT * " +
		"FROM vereine ",
		function(err, vereine){
			if (err){
				console.error(err)
			}
			res.locals.vereine = vereine
			res.render("stammdaten/vereine")

		}
	)
})



router.get("/edit/new", function(req, res){
	res.render("stammdaten/vereine/edit/new")
})

router.post("/edit/new", function(req, res){
	connection.query(
		"INSERT INTO vereine (name) " +
		"VALUES (?) ",
		[req.body.name],
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
		"FROM vereine " +
		"WHERE id = ? ",
		[req.params.id],
		function(err, vereine){
			if (err){
				console.error(err)
			}
			if(vereine.length >= 1){
				res.locals.verein = vereine[0]
				res.render("stammdaten/vereine/edit")
			} else {
				res.redirect("../")
			}
		}
	)
})

router.post("/edit/:id", function(req, res){
	connection.query(
		"UPDATE vereine " +
		"SET name = ? " +
		"WHERE id = ? ",
		[req.body.name, req.params.id],
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
		"DELETE FROM vereine " +
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
