var scheibe = require("./scheibe.js");

module.exports = {
	_id: "lg_demo",
	title: "LG Demo",
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
			probeEcke: true,
			neueScheibe: true,
			serienLength: 10,
			anzahlShots: 0,
			showInfos: true,
			zehntel: true,
			time: {
				enabled: false,
				duration: 0,
				instantStart: false,
			},
			average: {
				enabled: true,
				anzahl: 40,
			},
			exitType: "",
		},
		match: {
			title: "Match",
			probeEcke: false,
			neueScheibe: false,
			serienLength: 10,
			anzahlShots: 40,
			showInfos: true,
			zehntel: false,
			time: {
				enabled: false,
				duration: 0,
				instantStart: false,
			},
			average: {
				enabled: true,
				anzahl: 40,
			},
			exitType: "beforeFirst",
		},
	},
};
