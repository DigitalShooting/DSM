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

router.use("/", function(req, res, next){
	res.locals.stände = config.stände

	var collection = database.collection('vereine')
	collection.find().toArray(function(err, results) {
		res.locals.vereine = results

		collection = database.collection('schuetzen')
		collection.find().toArray(function(err, results) {
			res.locals.schuetzen = results

			next()
		})
	})
})

router.get("/", function(req, res){
	res.render("stände/index")
})


module.exports = router
