var express = require("express");
var router = express.Router();
var fs = require("fs")
var path = require("path")

router.get("/", function(req, res){
	res.render("lines/index")
})

module.exports = router
