module.exports = function(mysql, config){
	var lines = {
		lineID: {},
	};


	// get all lines
	lines.get = function create(req, res) {
		return res.send(201, config.lines);
	};

	// get line
	lines.lineID.get = function create(req, res) {
		for (var i in config.lines){
			var line = config.lines[i];
			if (line._id == req.params.lineID){
				return res.send(201, line);
			}
		}
		return res.send(201, {});
	};

	return lines;
};
