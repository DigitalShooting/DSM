var scheibe = require("./scheibe.js");

module.exports = {
	_id: "lg_training_5",
	title: "Training 5er",
	interface: {
		name: "esa",
		band: {
			onChangePart: 5,
			onShot: 2,
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
			probeEcke: true,
			mainPart: true,
			neueScheibe: true,
			serienLength: 5,
			anzahlShots: 0,
			showInfos: true,
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
