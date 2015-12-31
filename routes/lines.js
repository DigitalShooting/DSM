var express = require("express");
var router = express.Router();
var fs = require("fs")
var path = require("path")

router.get("/", function(req, res){
	res.redirect("./verwaltung/")
})

router.use("/verwaltung/", function(req, res){
	res.render("lines/verwaltung")
})
router.use("/log/", function(req, res){
	res.render("lines/log")
})

module.exports = router
