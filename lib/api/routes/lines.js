module.exports = function(mysql, config){
	var lines = {};


	// get all lines
	lines.get = function create(req, res, next) {
		return res.send(201, config.lines);
	};

	return lines;
};
