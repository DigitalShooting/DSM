module.exports = function(mysql, config){
	var disziplinen = {};

	var disziplinenArray = [];
	for (key in config.disziplinen.all){
		disziplinenArray.push(config.disziplinen.all[key]);
	}

	// get all disziplinen
	disziplinen.get = function create(req, res, next) {

		return res.send(201, disziplinenArray);
	}

	return disziplinen;
};
