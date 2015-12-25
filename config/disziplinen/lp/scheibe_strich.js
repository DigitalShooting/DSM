var zoom = require("./zoom_strich.js")

module.exports = {
	title: "LP 10m (Strich)",
	ringe: [
		{ value: 0, width: 0, color: "transparent", text: false, textColor: "transparent", zoom: zoom.z0, hitColor: "#00bffF" },
		{ value: 0, width: 0, color: "transparent", text: false, textColor: "transparent", zoom: zoom.z0, hitColor: "#00bffF" },
	],
	ringeDrawOnly: [],
	rechteckDrawOnly: [
		{ width:  29, height:  161, color: "black", hitColor: "#00bffF" },
	],
	defaultHitColor: "#00bffF",
	defaultZoom: zoom.z0,
	minZoom: zoom.z0,
	innenZehner: 0,
	probeEcke: { color: "#0f0", alpha: 0.7 },
	kugelDurchmesser: 4.5,
}
