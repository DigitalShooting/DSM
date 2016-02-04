module.exports = {
	/**
		Networking settings
		Settings for the HTTP module.
	*/


	// Webiterface port/ address
	webinterface: {
		port		:	3002,

		// IPv4/ IPv6 address to bin on. (BSP: "::1")
		address		: 	"0.0.0.0",
	},

	// API port/ addres (mapped to webinterface /api)
	api: {
		port		:	63432,
		address		: 	"127.0.0.1",
	},
};
