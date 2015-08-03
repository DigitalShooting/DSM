var express = require("express");
var router = express.Router();
var fs = require("fs")
var path = require("path")
var config = require("../../../config/")

var ObjectID = require("mongodb").ObjectID
var database
var mongodb = require("../../../lib/mongodb")(function(db){
	database = db
})



router.get("/:id/*", function(req, res, next){
	res.locals.stand = config.stände[req.params.id]

	if(res.locals.stand) {

		collection = database.collection('schuetzen')
		collection.find().toArray(function(err, results) {
			res.locals.schuetzen = results
			next()
		})

	} else {
		res.redirect("/staende/overview/")
	}
})

router.get("/:id/", function(req, res){
	res.redirect("./edit")
})

router.get("/:id/edit", function(req, res){
	res.render("stände/stand/edit")
})

router.get("/:id/view", function(req, res){
	res.render("stände/stand/view")
})

module.exports = router
