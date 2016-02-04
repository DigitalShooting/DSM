var express = require("express");
var router = express.Router();

router.get("/", function(req, res){
	res.redirect("./group/");
});

router.use("/group/", function(req, res){
	res.render("stats/group");
});

module.exports = router;
