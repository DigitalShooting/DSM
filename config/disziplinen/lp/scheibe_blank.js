var zoom = require("./zoom.js")

module.exports = {
	title: "LP 10m Blank",
	ringe: [
		{ value: 10, width:  11.5, color: "black", text: false, textColor: "transparent", zoom: zoom.z1, hitColor: "#00bffF" },
		{ value:  9, width:  27.5, color: "black", text: false, textColor: "transparent", zoom: zoom.z1, hitColor: "#00bffF" },
		{ value:  8, width:  43.5, color: "black", text: false, textColor: "transparent", zoom: zoom.z1, hitColor: "#00bffF" },
		{ value:  7, width:  59.5, color: "black", text: false, textColor: "transparent", zoom: zoom.z1, hitColor: "#00bffF" },
		{ value:  6, width:  75.5, color: "white", text: false, textColor: "transparent", zoom: zoom.z1, hitColor: "#00bffF" },
		{ value:  5, width:  91.5, color: "white", text: false, textColor: "transparent", zoom: zoom.z1, hitColor: "#00bffF" },
		{ value:  4, width: 107.5, color: "white", text: false, textColor: "transparent", zoom: zoom.z1, hitColor: "#00bffF" },
		{ value:  3, width: 123.5, color: "white", text: false, textColor: "transparent", zoom: zoom.z1, hitColor: "#00bffF" },
		{ value:  2, width: 139.5, color: "white", text: false, textColor: "transparent", zoom: zoom.z1, hitColor: "#00bffF" },
		{ value:  1, width: 155.5, color: "white", text: false, textColor: "transparent", zoom: zoom.z1, hitColor: "#00bffF" },
	],
	ringeDrawOnly: [],
	rechteckDrawOnly: [],
	defaultHitColor: "#000000",
	defaultZoom: zoom.z1,
	minZoom: zoom.z0,
	innenZehner: 475,
	probeEcke: { color: "#0f0", alpha: 0.7 },
	text: { size: 3.0, width: 0.9, up: 4.8, down: -2.6, left: 2.6, right: -4.8 },
	kugelDurchmesser: 4.5,
}
