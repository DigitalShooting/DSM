var express = require("express");
var router = express.Router();
var fs = require("fs")
var path = require("path")

var ObjectID = require("mongodb").ObjectID
var database
var mongodb = require("../../lib/mongodb")(function(db){
	database = db
})



router.get("/", function(req, res){
	collection = database.collection('schuetzen')
	collection.find().toArray(function(err, results) {
		res.locals.schuetzen = results
		res.render("stammdaten/schuetzen")
	})

	// connection.query(
	// 	"SELECT schuetzen.*, vereine.name as 'verein' " +
	// 	"FROM schuetzen " +
	// 	"LEFT OUTER JOIN vereine " +
	// 	"ON schuetzen.vereinID = vereine.id ",
	// 	function(err, schuetzen){
	// 		if (err){
	// 			console.error(err)
	// 		}
	// 		res.locals.schuetzen = schuetzen
	// 		res.render("stammdaten/schuetzen")
	//
	// 	}
	// )
})



router.get("/edit/*", function(req, res, next){
	collection = database.collection('vereine')
	collection.find().toArray(function(err, results) {
		res.locals.vereine = results
		next()
	})
})

router.get("/edit/new", function(req, res){
	res.render("stammdaten/schuetzen/edit/new")
})

router.post("/edit/new", function(req, res){
	collection = database.collection('schuetzen')
	collection.insert(req.body, function(err, docs) {
		res.redirect("../")
	})
})

router.get("/edit/:id", function(req, res){
	collection = database.collection('schuetzen')
	collection.find({"_id": new ObjectID(req.params.id)}).toArray(function(err, results) {
		if(results.length >= 1){
			res.locals.schuetze = results[0]
			res.render("stammdaten/schuetzen/edit")
		} else {
			res.redirect("../")
		}
	})
})

router.post("/edit/:id", function(req, res){
	collection = database.collection('schuetzen')
	collection.update({"_id": new ObjectID(req.params.id)}, req.body, function(err){
		res.redirect("../")
	})
})



router.get("/delete/:id", function(req, res){
	collection = database.collection('schuetzen')
	collection.remove({"_id": new ObjectID(req.params.id)}, function(err){
		res.redirect("../")
	})
})



module.exports = router
