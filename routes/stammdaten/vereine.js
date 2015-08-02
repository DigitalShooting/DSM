var express = require("express");
var router = express.Router();
var fs = require("fs")
var path = require("path")

var ObjectID = require("mongodb").ObjectID
var collection
var mongodb = require("../../lib/mongodb")(function(db){
	collection = db.collection('vereine')
})


router.get("/", function(req, res){
	collection.find().toArray(function(err, results) {
		res.locals.vereine = results
		res.render("stammdaten/vereine")
	})
})


router.get("/edit/new", function(req, res){
	var newObject = {}
	collection.insert(newObject, function(err, results){
		res.redirect(newObject._id)
	})
})


router.get("/edit/:id", function(req, res){
	collection.find({"_id": new ObjectID(req.params.id)}).toArray(function(err, results) {
		if(results.length >= 1){
			res.locals.verein = results[0]
			res.render("stammdaten/vereine/edit")
		} else {
			res.redirect("../")
		}
	})
})

router.post("/edit/:id", function(req, res){
	collection.update({"_id": new ObjectID(req.params.id)}, req.body, function(err){
		res.redirect("../")
	})
})



router.get("/delete/:id", function(req, res){
	collection.remove({"_id": new ObjectID(req.params.id)}, function(err){
		res.redirect("../")
	})
})



module.exports = router
