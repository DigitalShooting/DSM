var express = require("express");
var router = express.Router();
var fs = require("fs")
var path = require("path")
var connection = require("../../lib/connection")
var async = require("async")



router.get("/", function(req, res){
	connection.query(
		"SELECT * " +
		"FROM rwks ",
		function(err, rwks){
			if (err){
				console.error(err)
			}
			res.locals.rwks = rwks
			res.render("rwks/rwks")
		}
	)
})




router.get("/edit/*", function(req, res, next){
	connection.query(
		"SELECT manschaften.*, vereine.name as 'verein', saisons.jahr as 'saison', disziplinen.name as 'disziplin' " +
		"FROM manschaften " +
		"LEFT OUTER JOIN vereine " +
		"ON manschaften.vereinID = vereine.id " +
		"LEFT OUTER JOIN saisons " +
		"ON manschaften.saisonID = saisons.id " +
		"LEFT OUTER JOIN disziplinen " +
		"ON saisons.disziplinID = disziplinen.id ",
		function(err, manschaften){
			if (err){
				console.error(err)
			}
			res.locals.manschaften = manschaften
			next()
		}
	)
})

router.get("/edit/new", function(req, res){
	res.render("rwks/rwks/edit/new")
})

router.post("/edit/new", function(req, res){
	connection.query(
		"INSERT INTO rwks (name, saisonID, manschaftID_Heim, manschaftID_Gast) " +
		"VALUES (?, ?, ?, ?) ",
		[req.body.name, req.body.saisonID, req.body.manschaftID_Heim, req.body.manschaftID_Gast],
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
		"FROM rwks " +
		"WHERE id = ? ",
		[req.params.id],
		function(err, rwks){
			if (err){
				console.error(err)
			}
			if(rwks.length >= 1){
				res.locals.rwk = rwks[0]
				res.render("rwks/rwks/edit")
			} else {
				res.redirect("../")
			}
		}
	)
})

router.post("/edit/:id", function(req, res){
	connection.query(
		"UPDATE rwks " +
		"SET name = ?, saisonID = ?, manschaftID_Heim = ?, manschaftID_Gast = ?" +
		"WHERE id = ? ",
		[req.body.name, req.body.saisonID, req.body.manschaftID_Heim, req.body.manschaftID_Gast, req.params.id],
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
		"DELETE FROM rwks " +
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
