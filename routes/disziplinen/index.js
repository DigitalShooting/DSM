var express = require("express");
var router = express.Router();
var fs = require("fs")
var path = require("path")

router.get("/", function(req, res){
	res.render("disziplinen")
})


router.use("/scheiben/", require("./scheiben"))
router.use("/disziplinen/", require("./disziplinen"))

module.exports = router
