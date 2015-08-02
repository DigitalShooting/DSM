var express = require("express");
var router = express.Router();
var fs = require("fs")
var path = require("path")
var config = require("../../config/")


router.get("/:id", function(req, res){
	res.locals.stand = config.stände[req.params.id]

	console.log(res.locals.stand)
	if(res.locals.stand) {
		res.render("stände/stand")
	} else {
		res.redirect("/staende/overview/")
	}
})


module.exports = router
