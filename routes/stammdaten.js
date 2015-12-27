var express = require("express");
var router = express.Router();
var fs = require("fs")
var path = require("path")

router.get("/", function(req, res){
	res.redirect("./user/")
})


router.use("/user/", function(req, res){
	res.render("stammdaten/user")
})
router.use("/vereine/", function(req, res){
	res.render("stammdaten/vereine")
})


module.exports = router
