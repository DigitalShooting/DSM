const express = require("express");
const router = express.Router();
const config = require("../config/");
const child_process = require("child_process");
const socketIOClient = require('socket.io-client');

router.get("/", function(req, res){
		res.render("exit");
});

router.get("/confirm", function(req, res){
		console.log("[INFO] Shutting Down");

		var socket = socketIOClient(config.dscGateway.url);
		
		socket.on("onlineLines", (onlineLines) => {
			for (let lineID in onlineLines.lines) {
				socket.emit("setLine", {
					method: "shutdown",
					line: lineID,
					data: {
						auth: { key: config.dscGateway.key },
					}
				});
			}
			
			setTimeout(function(){
				child_process.exec("sudo shutdown -h now", function(){});
			}, 5000);
		});

		
		res.redirect("/");
});

module.exports = router;
