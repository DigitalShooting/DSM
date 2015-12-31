module.exports = function(mysql, config){
	var disziplinen = {};


	// get all disziplinen
	disziplinen.get = function create(req, res, next) {
		return res.send(201, config.disziplinen.all);
	}

	return disziplinen;
};
