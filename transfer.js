var mongodb = require("./lib/mongodb")(function(database){

	var collection = database.collection('schuetzen')
	collection.find().toArray(function(err, results) {

		for (var i in results){
			var user = results[i]

			user.firstName = user.vorname
			user.lastName = user.name

			update(user)
		}

	})



	function update(user){
		collection.update(user._id, user, function(err, results){
			console.log("insert", user, err)
		})
	}
})
