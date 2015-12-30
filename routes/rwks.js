var express = require("express");
var router = express.Router();
var fs = require("fs")
var path = require("path")

router.get("/", function(req, res){
	res.redirect("./manschaften/")
})

router.use("/manschaften/", function(req, res){
	res.render("rwks/manschaften")
})
router.use("/rwks/", function(req, res){
	res.render("rwks/rwks")
})
router.use("/activeRWKs/", function(req, res){
	res.render("rwks/activeRWKs")
})
router.use("/saisons/", function(req, res){
	res.render("rwks/saisons")
})

module.exports = router
