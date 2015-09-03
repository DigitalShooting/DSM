var express = require("express");
var router = express.Router();
var fs = require("fs")
var path = require("path")

router.get("/", function(req, res){
	res.render("stammdaten")
})


router.use("/vereine/", require("./vereine"))
router.use("/schuetzen/", require("./schuetzen"))

module.exports = router
