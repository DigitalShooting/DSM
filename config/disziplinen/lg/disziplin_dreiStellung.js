var scheibe = require("./scheibe.js")

module.exports = {
	_id: "lg_dreiStellung",
	title: "3 Stellung",
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
		instantStart: false,
	},
	scheibe: scheibe,
	parts: {
		probeK: {
			title: "Probe (Kniend)",
			probeEcke: true,
			neueScheibe: false,
			serienLength: 10,
			anzahlShots: 0,
			showInfos: true,
			zehntel: false,
			time: {
				enabled: false,
				duration: 0,
				instantStart: false,
			},
			average: {
				enabled: true,
				anzahl: 20,
			},
			exitType: "",
		},
		matchK: {
			title: "Match (Kniend)",
			probeEcke: false,
			neueScheibe: false,
			serienLength: 10,
			anzahlShots: 20,
			showInfos: true,
			zehntel: false,
			time: {
				enabled: false,
				duration: 0,
				instantStart: false,
			},
			average: {
				enabled: true,
				anzahl: 20
			},
			exitType: "beforeFirst",
		},
		probeL: {
			title: "Probe (Liegend)",
			probeEcke: true,
			neueScheibe: false,
			serienLength: 10,
			anzahlShots: 0,
			showInfos: true,
			zehntel: false,
			time: {
				enabled: false,
				duration: 0,
				instantStart: false,
			},
			average: {
				enabled: true,
				anzahl: 20,
			},
			exitType: "",
		},
		matchL: {
			title: "Match (Liegend)",
			probeEcke: false,
			neueScheibe: false,
			serienLength: 10,
			anzahlShots: 20,
			showInfos: true,
			zehntel: false,
			time: {
				enabled: false,
				duration: 0,
				instantStart: false,
			},
			average: {
				enabled: true,
				anzahl: 20,
			},
			exitType: "beforeFirst",
		},
		probeS: {
			title: "Probe (Stehend)",
			probeEcke: true,
			neueScheibe: false,
			serienLength: 10,
			anzahlShots: 0,
			showInfos: true,
			zehntel: false,
			time: {
				enabled: false,
				duration: 0,
				instantStart: false,
			},
			average: {
				enabled: true,
				anzahl: 20,
			},
			exitType: "",
		},
		matchS: {
			title: "Match (Stehend)",
			probeEcke: false,
			neueScheibe: false,
			serienLength: 10,
			anzahlShots: 20,
			showInfos: true,
			zehntel: false,
			time: {
				enabled: false,
				duration: 0,
				instantStart: false,
			},
			average: {
				enabled: true,
				anzahl: 20,
			},
			exitType: "beforeFirst",
		},
	},
}
