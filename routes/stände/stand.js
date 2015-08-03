var express = require("express");
var router = express.Router();
var fs = require("fs")
var path = require("path")
var config = require("../../config/")

var ObjectID = require("mongodb").ObjectID
var database
var mongodb = require("../../lib/mongodb")(function(db){
	database = db
})



router.get("/:id", function(req, res){
	res.locals.stand = config.stände[req.params.id]

	if(res.locals.stand) {

		collection = database.collection('schuetzen')
		collection.find().toArray(function(err, results) {
			res.locals.schuetzen = results
			res.render("stände/stand")
		})

	} else {
		res.redirect("/staende/overview/")
	}
})


module.exports = router
