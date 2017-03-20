module.exports = function(mysql, collection, config){
	return {
		verein: require("./verein.js")(mysql),
		user: require("./user.js")(mysql),
		disziplinen: require("./disziplinen.js")(mysql, config),
		lines: require("./lines.js")(mysql, config),
		manschaft: require("./manschaft.js")(mysql),
		group: require("./group.js")(mysql, config),
		sessions: require("./sessions.js")(collection),
	};
};
