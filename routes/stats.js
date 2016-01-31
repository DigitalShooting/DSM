var express = require("express");
var router = express.Router();
var fs = require("fs")
var path = require("path")

router.get("/", function(req, res){
	res.redirect("./group/")
})

router.use("/group/", function(req, res){
	res.render("stats/group")
})

module.exports = router
