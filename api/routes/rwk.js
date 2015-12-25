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
			order: "rwk.name",		// [name, id]
			orderDir: "DESC",
		}

		if (req.query.search != undefined){
			var strings = req.query.search.split(" ");
			var sql = ""
			for (i in strings){
				sql += "AND CONCAT_WS('|', rwk.id, rwk.name, rwk.datum, rwk.saisonID, rwk.note, rwk.manschaftHeim, rwk.manschaftGast, heim.name, gast.name) LIKE "+mysql.escape("%"+strings[i]+"%")+" COLLATE utf8_general_ci ";
			}
			query.searchSQL = sql;
		}

		if (req.query.limit != undefined){
			query.limit = parseInt(req.query.limit);
		}

		if (req.query.page != undefined){
			query.page = parseInt(req.query.page);
		}

		var validOrder = {
			name: "rwk.name",
			id: "rwk.id",
		};
		if (validOrder[req.query.order] != undefined){
			query.order = validOrder[req.query.order]
		}

		if (req.query.orderDir == "DESC" || req.query.orderDir == "ASC"){
			query.orderDir = req.query.orderDir
		}

		mysql.query(
			"SELECT rwk.id, rwk.name, rwk.datum, rwk.saisonID, rwk.note, rwk.manschaftHeim, rwk.manschaftGast, heim.name as 'heim', gast.name as 'gast' " +
			"FROM rwk " +
			"LEFT JOIN manschaft heim ON rwk.manschaftHeim = heim.id " +
			"LEFT JOIN manschaft gast ON rwk.manschaftGast = gast.id " +
			"WHERE 1 = 1 " +
			query.searchSQL +
			"ORDER BY " + query.order + " " + query.orderDir + " " +
			"LIMIT ? OFFSET ? ",
			[query.limit, query.limit*query.page],
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
			limit: 10,
			page: 0,
			order: "rwk.name",		// [name, id]
			orderDir: "DESC",
		}

		if (req.query.search != undefined){
			var strings = req.query.search.split(" ");
			var sql = ""
			for (i in strings){
				sql += "AND CONCAT_WS('|', rwk.id, rwk.name, rwk.datum, rwk.saisonID, rwk.note, rwk.manschaftHeim, rwk.manschaftGast, heim.name, gast.name) LIKE "+mysql.escape("%"+strings[i]+"%")+" COLLATE utf8_general_ci ";
			}
			query.searchSQL = sql;
		}

		mysql.query(
			"SELECT COUNT(*) as count " +
			"FROM rwk " +
			"LEFT JOIN manschaft heim ON rwk.manschaftHeim = heim.id " +
			"LEFT JOIN manschaft gast ON rwk.manschaftGast = gast.id " +
			"WHERE 1 = 1 " +
			query.searchSQL,
			[query.search],
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
			"SET rwk.name = ?, rwk.note = ?, rwk.manschaftHeim = ?, rwk.manschaftGast = ? " +
			"WHERE rwk.id = ?; ",
			[req.body.name, req.body.note, req.body.manschaftHeim, req.body.manschaftGast, req.params.id],
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
			"SELECT rwk.id, rwk.name, rwk.datum, rwk.saisonID, rwk.note, rwk.manschaftHeim, rwk.manschaftGast, heim.name as 'heim', gast.name as 'gast' " +
			"FROM rwk " +
			"LEFT JOIN manschaft heim ON rwk.manschaftHeim = heim.id " +
			"LEFT JOIN manschaft gast ON rwk.manschaftGast = gast.id " +
			"WHERE rwk.id = ? ",
			[id],
			function(err, rows, fields) {
				callback(rows[0]);
			}
		);
	}


	return rwk;
};
