module.exports = function(mysql, config){
	var disziplinen = {};

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
	disziplinen.get = function create(req, res, next) {
		return res.send(201, disziplinenArray);
	};

	return disziplinen;
};
