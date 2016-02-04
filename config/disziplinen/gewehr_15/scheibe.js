var zoom = require("./zoom.js");

module.exports = {
	title: "15m Gewehr",
	ringe: [
		{ value: 10, width:  4.5, color: "black", text: false, textColor: "white", zoom: zoom.z4, hitColor: "red" },
		{ value:  9, width:  13.5, color: "black", text: true, textColor: "white", zoom: zoom.z4, hitColor: "green" },
		{ value:  8, width:  22.5, color: "black", text: true, textColor: "white", zoom: zoom.z3, hitColor: "yellow" },
		{ value:  7, width:  31.5, color: "black", text: true, textColor: "white", zoom: zoom.z3, hitColor: "#00bffF" },
		{ value:  6, width:  40.5, color: "black", text: true, textColor: "white", zoom: zoom.z2, hitColor: "#00bffF" },
		{ value:  5, width:  49.5, color: "white", text: true, textColor: "black", zoom: zoom.z2, hitColor: "#00bffF" },
		{ value:  4, width:  58.5, color: "white", text: true, textColor: "black", zoom: zoom.z2, hitColor: "#00bffF" },
		{ value:  3, width:  67.5, color: "white", text: true, textColor: "black", zoom: zoom.z1, hitColor: "#00bffF" },
		{ value:  2, width:  76.5, color: "white", text: true, textColor: "black", zoom: zoom.z1, hitColor: "#00bffF" },
		{ value:  1, width:  85.5, color: "white", text: true, textColor: "black", zoom: zoom.z1, hitColor: "#00bffF" },
	],
	ringeDrawOnly: [],
	rechteckDrawOnly: [],
	defaultHitColor: "#000000",
	defaultZoom: zoom.z1,
	minZoom: zoom.z0,
	innenZehner: 0,
	probeEcke: { color: "#0f0", alpha: 0.7 },
	text: { size: 2.6, width: 0.9, up: 3.2, down: -1.2, left: 1.4, right: -3.2 },
	kugelDurchmesser: 4.5,
};
