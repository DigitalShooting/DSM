var scheibe = require("./scheibe.js");

module.exports = {
	_id: "gewehr_15_zimmerstutzen",
	title: "Zimmerstutzen",
	interface: {
		name: "esa",
		band: {
			onChangePart: 5,
			onShot: 3,
		},
	},
	time: {
		enabled: false,
		duration: 0,
		instantStart: false
	},
	scheibe: scheibe,
	parts: {
		probe: {
			title: "Probe",
			probeEcke: true,
			neueScheibe: false,
			serienLength: 10,
			anzahlShots: 0,
			showInfos: true,
			zehntel: false,
			time: {
				enabled: false,
				duration: 0,
				instantStart: false
			},
			average: {
				enabled: true,
				anzahl: 30
			},
			exitType: "",
		},
		match: {
			title: "Match",
			probeEcke: false,
			neueScheibe: false,
			serienLength: 10,
			anzahlShots: 30,
			showInfos: true,
			zehntel: false,
			time: {
				enabled: false,
				duration: 0,
				instantStart: false
			},
			average: {
				enabled: true,
				anzahl: 30
			},
			exitType: "beforeFirst",
		},
	},
};
