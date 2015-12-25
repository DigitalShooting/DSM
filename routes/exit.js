var express = require("express");
var router = express.Router();
var fs = require("fs")
var path = require("path")
var config = require("../config/")
var child_process = require("child_process")
var exec = require("exec")

router.get("/", function(req, res){
		res.render("exit")
})

router.get("/confirm", function(req, res){
		console.log("[INFO] Shutting Down")

		for (var i in config.lines){
				var line = config.lines[i]
				child_process.exec(["ssh -t "+line.user+"@"+line.ip+" 'sudo shutdown -h now'"], function(err, out, code) { })
		}

		setTimeout(function(){
				child_process.exec(["sudo shutdown -h now"], function(err, out, code) { })
		}, 5000)

		res.redirect("/")
})

module.exports = router
