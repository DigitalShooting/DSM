var gewehr15 = {
	zimmerstutzen: 	require("./gewehr_15/disziplin_zimmerstutzen.js"),
}
var lg = {
	dreiStellung: 	require("./lg/disziplin_dreiStellung.js"),
	auflage: 		require("./lg/disziplin_auflage.js"),
	blank: 			require("./lg/disziplin_blank.js"),
	demo_blank: 	require("./lg/disziplin_demo_blank.js"),
	demo: 			require("./lg/disziplin_demo.js"),
	finale: 		require("./lg/disziplin_finale.js"),
	training: 		require("./lg/disziplin_training.js"),
	training_5: 	require("./lg/disziplin_training_5.js"),
	wettkampf: 		require("./lg/disziplin_wettkampf.js"),
}
var lp = {
	blank: 			require("./lp/disziplin_blank.js"),
	auflage: 		require("./lp/disziplin_auflage.js"),
	demo: 			require("./lp/disziplin_demo.js"),
	demo_strich: 	require("./lp/disziplin_demo_strich.js"),
	finale: 		require("./lp/disziplin_finale.js"),
	strich: 		require("./lp/disziplin_strich.js"),
	training: 		require("./lp/disziplin_training.js"),
	training_5: 	require("./lp/disziplin_training_5.js"),
	wettkampf: 		require("./lp/disziplin_wettkampf.js"),
}


var all = {}
all[gewehr15.zimmerstutzen._id] = 	gewehr15.zimmerstutzen

all[lg.dreiStellung._id] =			lg.dreiStellung
all[lg.auflage._id] =				lg.auflage
all[lg.blank._id] =					lg.blank
all[lg.demo._id] =					lg.demo
all[lg.demo_blank._id] =			lg.demo_blank
all[lg.finale._id] =				lg.finale
all[lg.training._id] =				lg.training
all[lg.training_5._id] =			lg.training_5
all[lg.wettkampf._id] =				lg.wettkampf

all[lp.blank._id] =					lp.blank
all[lp.auflage._id] =				lp.auflage
all[lp.demo._id] =					lp.demo
all[lp.demo_strich._id] =			lp.demo_strich
all[lp.finale._id] =				lp.finale
all[lp.strich._id] =				lp.strich
all[lp.training._id] =				lp.training
all[lp.training_5._id] =			lp.training_5
all[lp.wettkampf._id] =				lp.wettkampf

module.exports = {
	groups: [
		{
			title: "LG",
			disziplinen: [
				lg.wettkampf._id,
				lg.finale._id,
				lg.training._id,
				lg.training_5._id,
				lg.auflage._id,
				lg.blank._id,
			]
		},
		{
			title: "LP",
			disziplinen: [
				lp.wettkampf._id,
				lp.finale._id,
				lp.training._id,
				lp.training_5._id,
				lp.auflage._id,
				lp.blank._id,
				lp.strich._id,
			]
		},
		{
			title: "Sonstige",
			disziplinen: [
				lg.dreiStellung._id,
				gewehr15.zimmerstutzen._id,
			]
		},
		{
			title: "Demo",
			disziplinen: [
				lg.demo._id,
				lp.demo._id,
				lg.demo_blank._id,
				lp.demo_strich._id,
			]
		},
	],


	all: all,

	// Default to start with
	defaultDisziplin: lg.training,
}
