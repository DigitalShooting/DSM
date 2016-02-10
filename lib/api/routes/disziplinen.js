module.exports = function(mysql, config){
	var disziplinen = {
		disziplinID: {},
	};

	var disziplinenArray = [];
	for (var i in config.disziplinen.groups){
		var group = config.disziplinen.groups[i];
		for (var ii in group.disziplinen){
			var disziplin = config.disziplinen.all[group.disziplinen[ii]];
			disziplin.type = group.title;
			disziplinenArray.push(disziplin);
		}
	}

	// get all disziplinen
	disziplinen.get = function create(req, res) {
		return res.send(201, disziplinenArray);
	};

	// get disziplin
	disziplinen.disziplinID.get = function create(req, res) {
		return res.send(201, config.disziplinen.all[req.params.disziplinID]);
	};

	return disziplinen;
};
