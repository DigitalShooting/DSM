var zoom = require("./zoom.js")

module.exports = {
	title: "LG 10m (Blank)",
	ringe: [
		{ value: 10, width:  0.5, color: "black", text: false, textColor: "transparent", zoom: zoom.z1, hitColor: "#00bffF" },
		{ value:  9, width:  5.5, color: "black", text: false, textColor: "transparent", zoom: zoom.z1, hitColor: "#00bffF" },
		{ value:  8, width: 10.5, color: "black", text: false, textColor: "transparent", zoom: zoom.z1, hitColor: "#00bffF" },
		{ value:  7, width: 15.5, color: "black", text: false, textColor: "transparent", zoom: zoom.z1, hitColor: "#00bffF" },
		{ value:  6, width: 20.5, color: "black", text: false, textColor: "transparent", zoom: zoom.z1, hitColor: "#00bffF" },
		{ value:  5, width: 25.5, color: "black", text: false, textColor: "transparent", zoom: zoom.z1, hitColor: "#00bffF" },
		{ value:  4, width: 30.5, color: "black", text: false, textColor: "transparent", zoom: zoom.z1, hitColor: "#00bffF" },
		{ value:  3, width: 35.5, color: "white", text: false, textColor: "transparent", zoom: zoom.z1, hitColor: "#00bffF" },
		{ value:  2, width: 40.5, color: "white", text: false, textColor: "transparent", zoom: zoom.z1, hitColor: "#00bffF" },
		{ value:  1, width: 45.5, color: "white", text: false, textColor: "transparent", zoom: zoom.z1, hitColor: "#00bffF" },
	],
	ringeDrawOnly: [],
	rechteckDrawOnly: [],
	defaultHitColor: "#000000",
	defaultZoom: zoom.z1,
	minZoom: zoom.z0,
	innenZehner: 200,
	probeEcke: { color: "#0f0", alpha: 0.7 },
	text: { size: 1.0, width: 0.3, up: 1.8, down: -0.8, left: 0.95, right: -1.7 },
	kugelDurchmesser: 4.5,
}
