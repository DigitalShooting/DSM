var express = require("express");
var router = express.Router();
var fs = require("fs")
var path = require("path")
var connection = require("../../lib/connection")



router.get("/", function(req, res){
	connection.query(
		"SELECT schuetzen.*, vereine.name as 'verein' " +
		"FROM schuetzen " +
		"LEFT OUTER JOIN vereine " +
		"ON schuetzen.vereinID = vereine.id ",
		function(err, schuetzen){
			if (err){
				console.error(err)
			}
			res.locals.schuetzen = schuetzen
			res.render("stammdaten/schuetzen")

		}
	)
})



router.get("/edit/*", function(req, res, next){
	connection.query(
		"SELECT * " +
		"FROM vereine ",
		function(err, vereine){
			if (err){
				console.error(err)
			}
			res.locals.vereine = vereine
			next()
		}
	)
})

router.get("/edit/new", function(req, res){
	res.render("stammdaten/schuetzen/edit/new")
})

router.post("/edit/new", function(req, res){
	console.log(req.body.name)
	connection.query(
		"INSERT INTO schuetzen (name, vorname, passnummer, vereinID) " +
		"VALUES (?, ?, ?, ?) ",
		[req.body.name, req.body.vorname, req.body.passnummer, req.body.verein],
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
		"FROM schuetzen " +
		"WHERE id = ? ",
		[req.params.id],
		function(err, schuetzen){
			if (err){
				console.error(err)
			}
			if(schuetzen.length >= 1){
				res.locals.schuetze = schuetzen[0]
				res.render("stammdaten/schuetzen/edit")
			} else {
				res.redirect("../")
			}
		}
	)
})

router.post("/edit/:id", function(req, res){
	connection.query(
		"UPDATE schuetzen " +
		"SET name = ?, vorname = ?, passnummer = ?, vereinID = ? " +
		"WHERE id = ? ",
		[req.body.name, req.body.vorname, req.body.passnummer, req.body.verein, req.params.id],
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
		"DELETE FROM schuetzen " +
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
