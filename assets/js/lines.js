angular.module("dsm.lines", [
	"dsm.services.sockets",
	"dsm.services.filter",

	"ui.select",
	"restangular",
])
.controller("LinesController", function ($scope, $cookies, gatewaySocket, Restangular) {
	$scope.store = {
		linesSelected: {},
		linesSelectedCount: 0,
	};

	$scope.selected = {}



	Restangular.all("/api/disziplinen").getList({
	}).then(function(disziplinen) {
		$scope.disziplinen = disziplinen;
		console.log(disziplinen)
	});






	// -- store lines recived from DSC-Gateway --
	$scope.lines = [];
	gatewaySocket.emit("getLines", {});

	// listen to DSC-Gateway updates
	gatewaySocket.on("disconnect", function(data){
		console.log(data)
		$scope.lines = data.lines
	})
	gatewaySocket.on("onlineLines", function(data){
		console.log(data)

		$scope.lines = data.lines
	})
	// --------------------------------------------





	// ----- toggle selected for line -------
	$scope.toggle = function(id, forceSet){
		if (forceSet != undefined){
			$scope.store.linesSelected[id] = forceSet;
		}
		else {
			$scope.store.linesSelected[id] = !$scope.store.linesSelected[id];
		}

		$scope.store.linesSelectedCount = 0;
		for (id in $scope.store.linesSelected) {
			if ($scope.store.linesSelected[id] == true) {
				$scope.store.linesSelectedCount++;
			}
		}

		writeToCookie();
	}
	// toggel selection for all
	$scope.toggleAll = function(value){
		for(id in $scope.lines){
			$scope.toggle(id, value)
		}
	}
	// ----------------------------------------






	// Update ui values
	// var updateUI = function(forceNameUpdate) {
	// 	$scope.selectedLines = 0
	// 	for (var i in $scope.state){
	// 		if ($scope.state[i] == true){
	// 			$scope.selectedLines++
	// 		}
	// 	}
	//
	// 	$scope.selectedConnectedLines = []
	// 	performOnSelected(function(line){
	// 		if (line.isConnected){
	// 			$scope.selectedConnectedLines.push(line)
	// 		}
	//
	//
	// 		if (line.session){
	// 			if (forceNameUpdate == true && line.isConnected){
	// 				$scope.selected.schuetze = line.session.user
	//
	// 				$scope.selected.verein = {}
	// 				$scope.selected.verein.name = line.session.user.verein
	// 				$scope.selected.verein.id = line.session.user.vereinID
	//
	// 				$scope.selectVerein()
	// 			}
	//
	// 			// Format Parts for select
	// 			$scope.parts = []
	// 			for (var id in line.session.disziplin.parts){
	// 				var part = line.session.disziplin.parts[id]
	// 				part.id = id
	// 				$scope.parts.push(part)
	// 			}
	//
	// 			// Set current disziplin
	// 			if (line.config){
	// 				$scope.selected.disziplin = line.config.disziplinen.all[line.session.disziplin._id]
	// 			}
	//
	// 			// Set current part
	// 			$scope.selected.part = line.session.disziplin.parts[line.session.type]
	//
	// 		}
	//
	//
	// 		if (line.config){
	//
	// 			// Set disziplinen for select
	// 			$scope.disziplinen = []
	// 			for (var i in line.config.disziplinen.groups){
	// 				var group = line.config.disziplinen.groups[i]
	// 				for (var key in group.disziplinen){
	// 					var disziplin = line.config.disziplinen.all[group.disziplinen[key]]
	// 					disziplin.type = group.title
	// 					$scope.disziplinen.push(disziplin)
	// 				}
	//
	// 			}
	//
	// 		}
	// 	})
	// }



	// Performs method on all selected clients
	function performOnSelected(callback){
		for (var id in $scope.store.linesSelected){
			if ($scope.store.linesSelected[id] == true){
				var line = $scope.lines[id];
				if (line.online == true){
					callback(id);
				}
			}
		}
	}



	// All funcs, to update dscs
	$scope.actions = {
		resetLine: function(){
			performOnSelected(function(id){
				gatewaySocket.api.setDisziplin(id, $scope.selected.disziplin._id)
			})
			// TODO reset name
		},
		selectDisziplin: function(){

			// Update Parts (TODO move to function)
			$scope.parts = [];
			for (id in $scope.selected.disziplin.parts){
				var part = $scope.selected.disziplin.parts[id];
				part.id = id;
				$scope.parts.push(part);
			}

			performOnSelected(function(id){
				gatewaySocket.api.setDisziplin(id, $scope.selected.disziplin._id)
			})
		},
		selectPart: function(){
			performOnSelected(function(id){
				gatewaySocket.api.setPart(id, $scope.selected.part.id)
			})
		},
		print: function(all){
			performOnSelected(function(id){
				gatewaySocket.api.print(id)
			})
		},
		newTarget: function(all){
			performOnSelected(function(id){
				gatewaySocket.api.setNewTarget(id)
			})
		},
		showMessage: function(type, title){
			performOnSelected(function(id){
				gatewaySocket.api.showMessage(id, type, title)
			})
		},
		hideMessage: function(){
			performOnSelected(function(id){
				gatewaySocket.api.hideMessage(id)
			})
		},
		shutdown: function(){
			performOnSelected(function(id){
				gatewaySocket.api.shutdown(id)
			})
		},
		wakeonlan: function(){
			performOnSelected(function(id){
				gatewaySocket.api.wakeonlan(id)
			})
		},
		resetUser: function(){
			performOnSelected(function(id){
				gatewaySocket.api.setUser(id, {
					firstName: "Gast",
					lastName: "",
					verein: "",
					manschaft: "",
				})
			})
			$scope.selected.user = null;
			$scope.selected.verein = null;
		},
		setUser: function(){
			if ($scope.selected.user != undefined && $scope.selected.user.firstName != undefined){
				performOnSelected(function(id){
					gatewaySocket.api.setUser(id, {
						firstName: $scope.selected.user.firstName,
						lastName: $scope.selected.user.lastName,
						verein: $scope.selected.user.verein,
						manschaft: "",
					})
				})
			}
		},
		openLine: function(){
			performOnSelected(function(id){
				var line = $scope.lines[id];
				var url = "http://" + line.ip + ":" + line.port;
				window.open(url, '_blank');
				// TODO add auth
			});
		},
		openLog: function(){
			performOnSelected(function(id){
				var line = $scope.lines[id];
				var url = "http://" + line.ip + ":" + line.port + "/log";
				window.open(url, '_blank');
			});
		}
	};







	$scope.$watch("selected.user", function() {
		if ($scope.selected.user != undefined && $scope.selected.user.vereinID != undefined){
			$scope.selected.verein = {
				id: $scope.selected.user.vereinID,
				name: $scope.selected.user.verein,
			};
		}
		$scope.actions.setUser();
	});

	$scope.getUsers = function(serachString) {
		var query = {
			search: serachString,
			limit: 100,
		}

		if ($scope.selected.verein != undefined){
			query.equals_vereinID = $scope.selected.verein.id;
		}
		return Restangular.one('/api/user').get(query).then(function(users) {
			return users;
		});
	};
	$scope.getUserTitle = function(user){
		if (user != undefined){
			return user.firstName + " " + user.lastName;
		}
		return "";
	}



	$scope.$watch("selected.verein", function() {
		if ($scope.selected.verein != undefined && $scope.selected.user != undefined && $scope.selected.verein.id != $scope.selected.user.vereinID){
			$scope.selected.user = null;
		}
	});

	$scope.getVereine = function(serachString) {
		return Restangular.one('/api/verein').get({
			search: serachString,
			limit: 1000,
		}).then(function(vereine) {
			return vereine;
		});
	};




	// $scope.selectVerein = function(){
	// 	// dsmSocket.emit("getUsersForVerein", {
	// 	// 	vereinID: $scope.selected.verein.id,
	// 	// })
	// 	// if ($scope.selected.schuetze != undefined){
	// 	// 	console.log($scope.selected.schuetze)
	// 	// 	if ($scope.selected.schuetze.vereinID != $scope.selected.verein.id){
	// 	// 		$scope.selected.schuetze = {}
	// 	// 	}
	// 	// }
	// }
	// dsmSocket.on("setUsersForVerein", function(users){
	// 	$scope.schuetzen = users
	// })
	//
	// $scope.selectSchuetze = function(){
	// 	var user = {
	// 		firstName: $scope.selected.schuetze.firstName,
	// 		lastName: $scope.selected.schuetze.lastName,
	// 		verein: $scope.selected.verein.name,
	// 		vereinID: $scope.selected.verein.id,
	// 		manschaft: "",
	// 	}
	//
	// 	performOnSelected(function(line){
	// 		if (line.isConnected == true){
	// 			// line.socket.emit("setUser", user)
	// 			console.log(user)
	// 			line.dscAPI.setUser(user)
	// 		}
	// 	})
	// }




	// Select Helper
	// $scope.groupByType = function (item){
	// 	return item.type;
	// };
	// $scope.groupSetup = {
	// 	theme: "bootstrap"
	// };
	//
	// function init(){
	// 	$scope.selectVerein()
	// }
	// init()







	// Cookie stuff
	var cookieData = $cookies.getObject('LinesController');
	if (cookieData != undefined){
		$scope.store = cookieData;
	}
	function writeToCookie(){
		$cookies.putObject('LinesController', $scope.store, {});
	}
})






// .controller('stand', function ($scope, lines, $timeout) {
// 	$scope.empty = true
// 	$scope.stand
//
// 	$timeout(function(){
// 		$scope.$watch('stand', function(value, old){
// 			$scope.stand = value
// 			updateUI()
// 		})
// 	})
//
//
// 	$('a[data-toggle="tab"]').on('shown.bs.tab', updateUI)
// 	function updateUI(){
// 		var socket = $scope.stand.socket
//
// 		socket.emit('getSession', {})
// 		socket.on("setSession", function(session){
// 			$scope.zoomlevel = session.disziplin.scheibe.defaultZoom
//
// 			$scope.scheibe = session.disziplin.scheibe
// 			$scope.probeecke = session.disziplin.parts[session.type].probeEcke
//
// 			$scope.session = session
//
// 			if (session.serien.length > 0){
// 				$scope.activeSerie = session.serien[session.selection.serie].shots
//
// 				$scope.serie = session.serien[session.selection.serie].shots
// 				$scope.selectedshotindex = session.selection.shot
// 				$scope.activeShot = session.serien[session.selection.serie].shots[session.selection.shot]
// 				$scope.empty = false
//
// 				if ($scope.serie != undefined && $scope.serie.length != 0) {
// 					var ringInt = $scope.serie[session.selection.shot].ring.int
// 					var ring = $scope.scheibe.ringe[$scope.scheibe.ringe.length - ringInt]
//
// 					if (ring){
// 						$scope.zoomlevel = ring.zoom
// 					}
// 					else if (ringInt == 0){
// 						$scope.zoomlevel = scheibe.minZoom
// 					}
// 				}
// 			}
// 			else {
// 				$scope.activeShot = undefined
// 				$scope.serie = []
// 				$scope.selectedshotindex = -1
// 				$scope.empty = true
// 			}
// 		})
// 	}
// 	$scope.updateUI = updateUI
//
// 	return {
// 		scope: {
// 			stand: '=',
// 		},
// 	}
//
//
// })
