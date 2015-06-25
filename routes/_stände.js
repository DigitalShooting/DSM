var express = require("express");
var router = express.Router();
var fs = require("fs")
var path = require("path")
var config = require("../config.js")

router.use("/", function(req, res, next){
	res.locals.stände = config.stände
	next()
})




router.get("/", function(req, res){
	res.redirect("/staende/overview")
})




router.get("/overview", function(req, res){
	res.render("stände/overview")
})




router.get("/edit/:id", function(req, res){
	res.locals.stand = config.stände[req.params.id]
	if(res.locals.stand) {
		res.render("stände/edit")
	} else {
		res.redirect("/staende/overview")
	}

})



module.exports = router
