module.exports = function(mysql, config){
	var rwk = {
		info: {},
		id: {},
	};


	// get all rwks
	rwk.get = function create(req, res, next) {
		var query = {
			searchSQL: "", // search
			limit: 10,
			page: 0,
			order: "rwk.date",		// [date, id]
			orderDir: "DESC",
			done: 0,
		}

		if (req.query.search != undefined){
			var strings = req.query.search.split(" ");
			var sql = ""
			for (i in strings){
				sql += "AND CONCAT_WS('|', rwk.id, rwk.date, rwk.saisonID, rwk.note, rwk.manschaftHeim, rwk.manschaftGast, heim.name, gast.name, heimSaison.name, gastSaison.name, heimVerein.name, gastVerein.name) LIKE "+mysql.escape("%"+strings[i]+"%")+" COLLATE utf8_general_ci ";
			}
			query.searchSQL = sql;
		}

		if (req.query.limit != undefined){
			query.limit = parseInt(req.query.limit);
		}

		if (req.query.page != undefined){
			query.page = parseInt(req.query.page);
		}

		if (req.query.orderDir == "DESC" || req.query.orderDir == "ASC"){
			query.orderDir = req.query.orderDir
		}

		var validOrder = {
			date:  "rwk.date "        + query.orderDir,
			heim:  "heimVerein.name " + query.orderDir  + ", rwk.manschaftHeim " + query.orderDir  + ", heimSaison.name " + query.orderDir,
			gast:  "gastVerein.name " + query.orderDir  + ", rwk.manschaftGast " + query.orderDir  + ", gastSaison.name " + query.orderDir,
			id:    "rwk.id "          + query.orderDir,
		};
		if (validOrder[req.query.order] != undefined){
			query.order = validOrder[req.query.order]
		}

		if (req.query.done != undefined){
			query.done = parseInt(req.query.done);
		}

		mysql.query(
			"SELECT rwk.id, rwk.date, rwk.saisonID, rwk.note, rwk.done, " +
				// manschaftID      manschaft name       saison name                      verein name
				"rwk.manschaftHeim, heim.name as 'heim', heimSaison.name as 'heimSaison', heimVerein.name as 'heimVerein', " +
				"rwk.manschaftGast, gast.name as 'gast', gastSaison.name as 'gastSaison', gastVerein.name as 'gastVerein' " +
			"FROM rwk " +
			"LEFT JOIN manschaft heim ON rwk.manschaftHeim = heim.id " +
				"LEFT JOIN saison heimSaison ON heim.saisonID = heimSaison.id " +
				"LEFT JOIN verein heimVerein ON heim.vereinID = heimVerein.id " +
			"LEFT JOIN manschaft gast ON rwk.manschaftGast = gast.id " +
				"LEFT JOIN saison gastSaison ON gast.saisonID = gastSaison.id " +
				"LEFT JOIN verein gastVerein ON gast.vereinID = gastVerein.id " +
			"WHERE rwk.done = ? " +
			query.searchSQL +
			"ORDER BY " + query.order + " " +
			"LIMIT ? OFFSET ? ",
			[query.done, query.limit, query.limit*query.page],
			function(err, rows, fields) {
				return res.send(201, rows);
			}
		);
	}

	// new rwk
	rwk.post = function create(req, res, next) {
		mysql.query(
			"INSERT INTO rwk VALUES() ",
			[],
			function(err, rows, fields) {
				getRWK(rows.insertId, function(rows){
					return res.send(201, rows);
				})
			}
		);
	}



	// get rwk count
	rwk.info.get = function create(req, res, next) {
		var query = {
			searchSQL: "", // search
			done: 0,
		}

		if (req.query.search != undefined){
			var strings = req.query.search.split(" ");
			var sql = ""
			for (i in strings){
				sql += "AND CONCAT_WS('|', rwk.id, rwk.date, rwk.saisonID, rwk.note, rwk.manschaftHeim, rwk.manschaftGast, heim.name, gast.name, heimSaison.name, gastSaison.name, heimVerein.name, gastVerein.name) LIKE "+mysql.escape("%"+strings[i]+"%")+" COLLATE utf8_general_ci ";
			}
			query.searchSQL = sql;
		}

		if (req.query.done != undefined){
			query.done = parseInt(req.query.done);
		}

		mysql.query(
			"SELECT COUNT(*) as count " +
			"FROM rwk " +
			"LEFT JOIN manschaft heim ON rwk.manschaftHeim = heim.id " +
				"LEFT JOIN saison heimSaison ON heim.saisonID = heimSaison.id " +
				"LEFT JOIN verein heimVerein ON heim.vereinID = heimVerein.id " +
			"LEFT JOIN manschaft gast ON rwk.manschaftGast = gast.id " +
				"LEFT JOIN saison gastSaison ON gast.saisonID = gastSaison.id " +
				"LEFT JOIN verein gastVerein ON gast.vereinID = gastVerein.id " +
			"WHERE rwk.done = ? " +
			query.searchSQL,
			[query.done, query.search],
			function(err, rows, fields) {
				return res.send(201, rows[0]);
			}
		);
	}




	// get rwk with id
	rwk.id.get = function create(req, res, next) {
		getRWK(req.params.id, function(rows){
			return res.send(201, rows);
		})
	}

	// edit rwk
	rwk.id.post = function create(req, res, next) {
		mysql.query(
			"UPDATE rwk " +
			"SET rwk.date = ?, rwk.note = ?, rwk.manschaftHeim = ?, rwk.manschaftGast = ?, rwk.done = ? " +
			"WHERE rwk.id = ?; ",
			[req.body.date, req.body.note, req.body.manschaftHeim, req.body.manschaftGast, parseInt(req.body.done), req.params.id],
			function(err, rows, fields) {
				return res.send(201, rows);
			}
		);
		res.send(201, {});
	}

	// delete rwk
	rwk.id.del = function create(req, res, next) {
		mysql.query(
			"DELETE FROM rwk " +
			"WHERE rwk.id = ?; ",
			[req.params.id],
			function(err, rows, fields) {
				return res.send(201, rows);
			}
		);
		res.send(201, {});
	}



	// Helper
	function getRWK(id, callback){
		mysql.query(
			"SELECT rwk.id, rwk.date, rwk.saisonID, rwk.note, rwk.done, " +
				// manschaftID      manschaft name       saison name                      verein name
				"rwk.manschaftHeim, heim.name as 'heim', heimSaison.name as 'heimSaison', heimVerein.name as 'heimVerein', " +
				"rwk.manschaftGast, gast.name as 'gast', gastSaison.name as 'gastSaison', gastVerein.name as 'gastVerein' " +
			"FROM rwk " +
			"LEFT JOIN manschaft heim ON rwk.manschaftHeim = heim.id " +
				"LEFT JOIN saison heimSaison ON heim.saisonID = heimSaison.id " +
				"LEFT JOIN verein heimVerein ON heim.vereinID = heimVerein.id " +
			"LEFT JOIN manschaft gast ON rwk.manschaftGast = gast.id " +
				"LEFT JOIN saison gastSaison ON gast.saisonID = gastSaison.id " +
				"LEFT JOIN verein gastVerein ON gast.vereinID = gastVerein.id " +
			"WHERE rwk.id = ? ",
			[id],
			function(err, rows, fields) {
				callback(rows[0]);
			}
		);
	}

	return rwk;
};
