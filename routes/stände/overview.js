var express = require("express");
var router = express.Router();
var fs = require("fs")
var path = require("path")
var config = require("../../config/")

router.use("/", function(req, res, next){
	res.locals.stände = config.stände
	next()
})

router.get("/", function(req, res){
	res.render("stände/overview")
})

module.exports = router
