module.exports = function(mysql, config){
	return {
		verein: require("./verein.js")(mysql, config),
		user: require("./user.js")(mysql, config),
		saison: require("./saison.js")(mysql, config),
		disziplinen: require("./disziplinen.js")(mysql, config),
		lines: require("./lines.js")(mysql, config),
		manschaft: require("./manschaft.js")(mysql, config),
		rwk: require("./rwk.js")(mysql, config),
		memberIn: require("./memberIn.js")(mysql, config),
	}
}
