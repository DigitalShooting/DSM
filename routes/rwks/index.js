var express = require("express");
var router = express.Router();
var fs = require("fs")
var path = require("path")

router.get("/", function(req, res){
	res.render("rwks")
})

router.use("/manschaften/", require("./manschaften"))
router.use("/rwks/", require("./rwks"))

module.exports = router
