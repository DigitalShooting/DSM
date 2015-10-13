var mysql = require("../lib/mysql.js")
var fs = require("fs")


// mysql.query(
// 	"SELECT user.*, verein.name as 'verein' " +
// 	"FROM user " +
// 	"LEFT OUTER JOIN verein " +
// 	"ON user.vereinID = verein.id",
// 	function(err, rows, fields) {
//
// 	}
// );




var parse = require('csv-parse');

var input = fs.readFileSync(__dirname+"/input.csv", "utf8") //'#Welcome\n"1","2","3","4"\n"a","b","c","d"';

// 0 undefined
// 1 verein id
// 2 ?
// 3 ?
// 4 name
// 5 vorname
// 6 ?
// 7 Geschlecht (M/W)
// 8 ?
// 9 Straße
// 10 Ort
// 11 ?
// 12 ?
// 13 Passnummer
// 20 Verein name


parse(input, {comment: "#", delimiter: ";"}, function(err, output){
	var users = []
	var vereine = []

	for (var i in output){
		var data = output[i]

		var verein = {
			id: data[1],
			name: data[20],
		}
		vereine["id"+verein.id] = verein

		var user = {
			undef0: data[0],
			undef1: data[1],
			undef2: data[2],
			undef3: data[3],

			lastName: data[4],
			firstName: data[5],

			undef4: data[6],

			sex: data[7],

			undef5: data[8],

			street: data[9],

			undef6: data[10],

			zip: data[10],
			city: data[11],

			undef7: data[12],

			passnumber: data[14],

			undef8: data[13],
			undef9: data[15],
			undef10: data[16],
			undef11: data[17],
			undef12: data[18],
			undef13: data[19],

			vereinID: verein.id,
		}
		users.push(user)
	}


	// for (var i in vereine){
	// 	var verein = vereine[i]
	// 	console.log(verein)
	// 	mysql.query(
	// 		"INSERT INTO verein (id, name) VALUES (?, ?)",
	// 		[verein.id, verein.name],
	// 		function(err, result){
	// 			console.log(err)
	// 		}
	// 	)
	// }

	for (var i in users){
		var user = users[i]
		mysql.query(
			"INSERT INTO user (firstName, lastName, vereinID, passnummer, undef0, undef1, undef2, undef3, undef4, undef5, undef6, undef7, undef8, undef9, undef10, undef11, undef12, undef13) VALUES (?, ?, ?, ?,  ?,?,?,?,?,?, ?,?,?,?,?,?, ?,?)",
			[
				user.firstName, user.lastName, user.vereinID, user.passnumber,
				user.undef0, user.undef1, user.undef2, user.undef3, user.undef4, user.undef5,
				user.undef6, user.undef7, user.undef8, user.undef9, user.undef10, user.undef11,
				user.undef12, user.undef13,
			],
			function(err, result){
				console.log(err)
			}
		)
	}

	// mysql.query(
	// 	"INSERT INTO vereine (id, name) VALUES (?, ?)",
	// 	vereine,
	// 	function(err, result){
	// 		console.log(err)

			// mysql.query(
			// 	"INSERT INTO user (firstName, lastName, vereinID) VALUES ?",
			// 	users,
			// 	function(err, result){
			// 		console.log(err)
			//
			// 		process.exit()
			// 	}
			// )

	// 	}
	// )

	// console.log(vereine)
	// console.log(users)

});
