var express = require("express");
var router = express.Router();

router.get("/", function(req, res){
	res.redirect("./group/");
});

router.use("/group/", function(req, res){
	res.render("stats/group");
});

router.use("/gpk/", function(req, res){
	res.render("stats/gpk");
});

module.exports = router;
