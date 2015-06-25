var express = require("express");
var router = express.Router();
var fs = require("fs")
var path = require("path")
var connection = require("../../lib/connection")



router.get("/", function(req, res){
	connection.query(
		"SELECT * " +
		"FROM scheiben ",
		function(err, scheiben){
			if (err){
				console.error(err)
			}
			res.locals.scheiben = scheiben
			res.render("disziplinen/scheiben")
		}
	)
})



router.get("/edit/*", function(req, res, next){
	connection.query(
		"SELECT * " +
		"FROM scheiben ",
		function(err, scheiben){
			if (err){
				console.error(err)
			}
			res.locals.scheiben = scheiben
			next()
		}
	)
})

router.get("/edit/new", function(req, res){
	res.render("disziplinen/scheiben/edit/new")
})

router.post("/edit/new", function(req, res){
	connection.query(
		"INSERT INTO scheiben (name) " +
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
		"FROM scheiben " +
		"WHERE id = ? ",
		[req.params.id],
		function(err, scheiben){
			if (err){
				console.error(err)
			}
			if(scheiben.length >= 1){
				res.locals.scheibe = scheiben[0]
				res.render("disziplinen/scheiben/edit")
			} else {
				res.redirect("../")
			}
		}
	)
})

router.post("/edit/:id", function(req, res){
	connection.query(
		"UPDATE scheiben " +
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
		"DELETE FROM scheiben " +
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
