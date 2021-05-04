const fs = require('fs');

let config;

const DSMConfig = process.env["DSMConfig"];
if (DSMConfig != null) {
	let rawdata = fs.readFileSync(DSMConfig);
	config = JSON.parse(rawdata);
	config.dsm = require("./dsm.js");
	config.disziplinen = require("../disziplinen/");
}
else {
	config = {
		database: require("./database.js"),
		lines : require("./lines.js"),
		network	: require("./network.js"),
		dscGateway: require("./dscGateway.js"),
		dsm: require("./dsm.js"),
		disziplinen: require("../disziplinen/"),
	};
}

module.exports = config;
