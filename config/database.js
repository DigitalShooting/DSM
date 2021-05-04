module.exports = {
	host     : "127.0.0.1",
	user     : "user",
	password : "pass",
	database : "db",
	dateStrings: "date",  // Required to get correct date

	// mongodb connection params
	mongodb: {
		url: "mongodb://localhost:27017",
		db: "dsc-gateway",
		collection: "dsc-gateway_main",
	},
};
