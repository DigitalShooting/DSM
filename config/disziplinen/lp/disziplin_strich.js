var scheibe = require("./scheibe_strich.js");

module.exports = {
	_id: "lp_strich",
	title: "Strich",
	interface: {
		name: "esa",
		band: {
			onChangePart: 5,
			onShot: 4,
		},
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
			mainPart: true,
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
