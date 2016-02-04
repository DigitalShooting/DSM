var scheibe = require("./scheibe_strich.js");

module.exports = {
	_id: "lp_demo_strich",
	title: "LP Demo Strich",
	interface: {
		name: "demo",
		time: 2500,
	},
	time: {
		enabled: false,
		duration: 0,
		instantStart: false,
	},
	scheibe: scheibe,
	parts: {
		probe: {
			title: "Probe",
			probeEcke: false,
			neueScheibe: true,
			serienLength: 50,
			anzahlShots: 0,
			showInfos: false,
			zehntel: false,
			time: {
				enabled: false,
				duration: 0,
				instantStart: false,
			},
			average: {
				enabled: false,
				anzahl: 0,
			},
			exitType: "",
		},
	},
};
