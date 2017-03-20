var express = require("express");
var router = express.Router();

router.get("/", function(req, res){
	res.redirect("./user/");
});


router.use("/user/", function(req, res){
	res.render("stammdaten/user");
});
router.use("/vereine/", function(req, res){
	res.render("stammdaten/vereine");
});
router.use("/manschaften/", function(req, res){
	res.render("stammdaten/manschaften");
});


module.exports = router;
