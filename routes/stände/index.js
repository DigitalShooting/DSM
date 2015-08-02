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
	res.redirect("/staende/overview/")
})

router.use("/overview/", require("./overview.js"))
router.use("/stand/", require("./stand.js"))

module.exports = router
