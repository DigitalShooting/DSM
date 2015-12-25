var restify = require('restify');
var config = require("../config/");
var fs = require('fs');
var mysql = require("../lib/mysql.js")

var server = restify.createServer({
	name: 'MyApp',
});
server.listen(3000);

server.use(restify.bodyParser({ mapParams: false }));
server.use(restify.queryParser());




// ------------------------------------------
// session
// ------------------------------------------
server.get('/session', function create(req, res, next) {
	return res.send(201, Math.random().toString(36).substr(3, 8));
});
// ------------------------------------------
// ------------------------------------------
// ------------------------------------------





// ------------------------------------------
// verein
// ------------------------------------------
server.get('/verein/info', function create(req, res, next) {
	var query = {
		searchSQL: "", // search
		limit: 10,
		page: 0,
		order: "verein.name",		// [name, id]
		orderDir: "DESC",
	}

	if (req.query.search != undefined){
		var strings = req.query.search.split(" ");
		var sql = ""
		for (i in strings){
			sql += "AND CONCAT_WS('|', verein.id, verein.name) LIKE "+mysql.escape("%"+strings[i]+"%")+" COLLATE utf8_general_ci ";
		}
		query.searchSQL = sql;
	}

	mysql.query(
		"SELECT COUNT(*) as count " +
		"FROM verein " +
		"WHERE 1 = 1 " +
		query.searchSQL,
		[query.search],
		function(err, rows, fields) {
			return res.send(201, rows[0]);
		}
	);
});

server.get('/verein', function create(req, res, next) {
	var query = {
		searchSQL: "", // search
		limit: 10,
		page: 0,
		order: "verein.name",		// [name, id]
		orderDir: "DESC",
	}

	if (req.query.search != undefined){
		var strings = req.query.search.split(" ");
		var sql = ""
		for (i in strings){
			sql += "AND CONCAT_WS('|', verein.id, verein.name, verein.note) LIKE "+mysql.escape("%"+strings[i]+"%")+" COLLATE utf8_general_ci ";
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
		name: "verein.name",
		id: "verein.id",
	};
	if (validOrder[req.query.order] != undefined){
		query.order = validOrder[req.query.order]
	}

	if (req.query.orderDir == "DESC" || req.query.orderDir == "ASC"){
		query.orderDir = req.query.orderDir
	}

	mysql.query(
		"SELECT *" +
		"FROM verein " +
		"WHERE 1 = 1 " +
		query.searchSQL +
		"ORDER BY " + query.order + " " + query.orderDir + " " +
		"LIMIT ? OFFSET ? ",
		[query.limit, query.limit*query.page],
		function(err, rows, fields) {
			console.log(err)
			return res.send(201, rows);
		}
	);
});
server.post('/verein', function create(req, res, next) {
	mysql.query(
		"INSERT INTO verein VALUES() ",
		[],
		function(err, rows, fields) {
			getVerein(rows.insertId, function(rows){
				return res.send(201, rows);
			})
		}
	);
});


server.get('/verein/:id', function create(req, res, next) {
	getVerein(req.params.id, function(rows){
		return res.send(201, rows);
	})
});

server.post('/verein/:id', function create(req, res, next) {
	console.log("hallo",req.body)
	mysql.query(
		"UPDATE verein " +
		"SET verein.name = ?, verein.note = ?" +
		"WHERE verein.id = ?; ",
		[req.body.name, req.body.note, req.params.id],
		function(err, rows, fields) {
			return res.send(201, rows);
		}
	);
	res.send(201, {});
});
server.del('/verein/:id', function create(req, res, next) {
	mysql.query(
		"DELETE FROM verein " +
		"WHERE verein.id = ?; ",
		[req.params.id],
		function(err, rows, fields) {
			return res.send(201, rows);
		}
	);
	res.send(201, {});
});



function getVerein(id, callback){
	mysql.query(
		"SELECT verein.id, verein.name, verein.note " +
		"FROM verein " +
		"WHERE verein.id = ? ",
		[id],
		function(err, rows, fields) {
			console.log(err, rows, parseInt(id))
			callback(rows[0]);
		}
	);
}



// ------------------------------------------
// ------------------------------------------
// ------------------------------------------








// ------------------------------------------
// user
// ------------------------------------------
server.get('/user/info', function create(req, res, next) {
	var query = {
		searchSQL: "",
	}

	if (req.query.search != undefined){
		var strings = req.query.search.split(" ");
		var sql = ""
		for (i in strings){
			sql += "AND CONCAT_WS('|', user.lastName, user.firstName, user.id, user.vereinID, user.note, user.passnummer, verein.name) LIKE "+mysql.escape("%"+strings[i]+"%")+" COLLATE utf8_general_ci ";
		}
		query.searchSQL = sql;
	}

	mysql.query(
		"SELECT COUNT(*) as count " +
		"FROM user " +
		"LEFT JOIN verein ON user.vereinID = verein.id " +
		"WHERE 1 = 1 " +
		query.searchSQL,
		[query.search],
		function(err, rows, fields) {
			return res.send(201, rows[0]);
		}
	);
});


server.get('/user', function create(req, res, next) {
	var query = {
		searchSQL: "", // search
		limit: 10,
		page: 0,
		order: "user.lastName",		// [lastName, firstName, verein, id, passnummer, vereinID]
		orderDir: "DESC",
	}

	if (req.query.search != undefined){
		var strings = req.query.search.split(" ");
		var sql = ""
		for (i in strings){
			sql += "AND CONCAT_WS('|', user.lastName, user.firstName, user.id, user.vereinID, user.note, user.passnummer, verein.name) LIKE "+mysql.escape("%"+strings[i]+"%")+" COLLATE utf8_general_ci ";
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
		lastName: "user.lastName",
		firstName: "user.firstName",
		verein: "verein.name",
		id: "user.id",
		passnummer: "user.passnummer",
		vereinID: "verein.id",
	};
	if (validOrder[req.query.order] != undefined){
		query.order = validOrder[req.query.order]
	}

	if (req.query.orderDir == "DESC" || req.query.orderDir == "ASC"){
		query.orderDir = req.query.orderDir
	}

	mysql.query(
		"SELECT user.lastName, user.firstName, user.id, user.vereinID, user.note, user.passnummer, verein.name as 'verein'" +
		"FROM user " +
		"LEFT JOIN verein ON user.vereinID = verein.id " +
		"WHERE 1 = 1 " +
		query.searchSQL +
		"ORDER BY " + query.order + " " + query.orderDir + " " +
		"LIMIT ? OFFSET ? ",
		[query.limit, query.limit*query.page],
		function(err, rows, fields) {
			console.log(err)
			return res.send(201, rows);
		}
	);
});

server.post('/user', function create(req, res, next) {
	mysql.query(
		"INSERT INTO user VALUES() ",
		[],
		function(err, rows, fields) {
			console.log(err, rows.insertId)
			getUser(rows.insertId, function(rows){
				console.log(rows)
				return res.send(201, rows);
			})
		}
	);
});


server.get('/user/:id', function create(req, res, next) {
	getUser(req.params.id, function(rows){
		return res.send(201, rows);
	})
});
server.post('/user/:id', function create(req, res, next) {
	console.log(req.body, req.params.id)
	mysql.query(
		"UPDATE user " +
		"SET user.lastName = ?, user.firstName = ?, user.vereinID = ?, user.note = ?, user.passnummer = ?, user.vereinID = ? " +
		"WHERE user.id = ?; ",
		[req.body.lastName, req.body.firstName, req.body.vereinID, req.body.note, req.body.passnummer, req.body.vereinID, req.params.id],
		function(err, rows, fields) {
			return res.send(201, rows);
		}
	);
	res.send(201, {});
});
server.del('/user/:id', function create(req, res, next) {
	mysql.query(
		"DELETE FROM user " +
		"WHERE user.id = ?; ",
		[req.params.id],
		function(err, rows, fields) {
			return res.send(201, rows);
		}
	);
	res.send(201, {});
});




function getUser(id, callback){
	mysql.query(
		"SELECT user.lastName, user.firstName, user.id, user.vereinID, user.note, user.passnummer, verein.name as 'verein' " +
		"FROM user " +
		"LEFT JOIN verein ON user.vereinID = verein.id " +
		"WHERE user.id = ? ",
		[id],
		function(err, rows, fields) {
			console.log(err, rows, parseInt(id))
			callback(rows[0]);
		}
	);
}

// ------------------------------------------
// ------------------------------------------
// ------------------------------------------
