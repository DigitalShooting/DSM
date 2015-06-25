var express = require("express");
var router = express.Router();
var fs = require("fs")
var path = require("path")
var connection = require("../../lib/connection")
var async = require("async")



router.get("/", function(req, res){
	connection.query(
		"SELECT * " +
		"FROM disziplinen ",
		function(err, disziplinen){
			if (err){
				console.error(err)
			}
			res.locals.disziplinen = disziplinen
			res.render("disziplinen/disziplinen")

		}
	)
})



router.get("/edit/*", function(req, res, next){
	async.parallel(
		{
			scheiben: function(callback) {
				connection.query(
					"SELECT * " +
					"FROM scheiben ",
					function(err, scheiben){
						if (err){
							console.error(err)
						}
						callback(null, scheiben)
					}
				)
			}
		},
		function(err, results) {
			res.locals.scheiben = results.scheiben
			next()
		}
	)
})

router.get("/edit/new", function(req, res){
	res.render("disziplinen/disziplinen/edit/new")
})

router.post("/edit/new", function(req, res){
	connection.query(
		"INSERT INTO disziplinen (name, scheibenID) " +
		"VALUES (?, ?) ",
		[req.body.name, req.body.scheibenID],
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
		"FROM disziplinen " +
		"WHERE id = ? ",
		[req.params.id],
		function(err, disziplinen){
			if (err){
				console.error(err)
			}
			if(disziplinen.length >= 1){
				res.locals.disziplin = disziplinen[0]
				res.render("disziplinen/disziplinen/edit")
			} else {
				res.redirect("../")
			}
		}
	)
})

router.post("/edit/:id", function(req, res){
	connection.query(
		"UPDATE disziplinen " +
		"SET name = ?, scheibenID = ? " +
		"WHERE id = ? ",
		[req.body.name, req.body.scheibenID, req.params.id],
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
		"DELETE FROM disziplinen " +
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
