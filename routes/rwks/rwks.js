var express = require("express");
var router = express.Router();
var fs = require("fs")
var path = require("path")
var async = require("async")

var ObjectID = require("mongodb").ObjectID
var database
var mongodb = require("../../lib/mongodb")(function(db){
	database = db
})



router.get("/", function(req, res){
	collection = database.collection('rwks')
	collection.find().toArray(function(err, results) {
		res.locals.rwks = results
		res.render("rwks/rwks")
	})
})



router.get("/edit/*", function(req, res, next){
	collection = database.collection('manschaften')
	collection.find().toArray(function(err, results) {
		res.locals.manschaften = results
		next()
	})
})

router.get("/edit/new", function(req, res){
	var newObject = {}
	collection = database.collection('rwks')
	collection.insert(newObject, function(err, results){
		res.redirect(newObject._id)
	})
})

router.get("/edit/:id", function(req, res){
	collection = database.collection('rwks')
	collection.find({"_id": new ObjectID(req.params.id)}).toArray(function(err, results) {
		if(results.length >= 1){
			res.locals.rwk = results[0]
			res.render("rwks/rwks/edit")
		} else {
			res.redirect("../")
		}
	})
})

router.post("/edit/:id", function(req, res){
	collection = database.collection('rwks')
	collection.update({"_id": new ObjectID(req.params.id)}, req.body, function(err){
		res.redirect("../")
	})
})



router.get("/delete/:id", function(req, res){
	collection = database.collection('rwks')
	collection.remove({"_id": new ObjectID(req.params.id)}, function(err){
		res.redirect("../")
	})
})



module.exports = router
