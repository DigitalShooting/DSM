angular.module("dsm.lines", [
	"dsm.services.sockets",
	"dsm.services.filter",

	"ui.select",
	"restangular",
])
.controller("LinesController", function ($scope, lines, dsmSocket, $cookies, gatewaySocket, Restangular) {
	$scope.store = {
		linesSelected: {},
	};

	// store lines recived from DSC-Gateway
	$scope.lines = [];

	// listen to DSC-Gateway updates
	gatewaySocket.on("disconnect", function(data){
		console.log(data)
		$scope.lines = data.lines
	})
	gatewaySocket.on("onlineLines", function(data){
		console.log(data)

		$scope.lines = data.lines
	})





	// toggle selected for line
	$scope.toggle = function(id, forceSet){
		if (forceSet != undefined){
			$scope.store.linesSelected[id] = forceSet;
		}
		else {
			$scope.store.linesSelected[id] = !$scope.store.linesSelected[id];
		}
		writeToCookie();
	}
	// toggel selection for all
	$scope.toggleAll = function(value){
		for(id in $scope.lines){
			$scope.toggle(id, value)
		}
		console.log(value)
	}






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
		$scope.lines.forEach(function(line){
			if($scope.state[line._id] == true){
				callback(line)
			}
		})
	}




	// Send selected disziplin
	$scope.selectDisziplin = function(){
		performOnSelected(function(line){
			if (line.isConnected == true){
				line.dscAPI.setDisziplin($scope.selected.disziplin._id)
			}
		})
	}

	// Send selected part
	$scope.selectPart = function(){
		performOnSelected(function(line){
			if (line.isConnected == true){
				line.dscAPI.setPart($scope.selected.part.id)
			}
		})
	}

	// Set power for line
	$scope.setPower = function(value){
		performOnSelected(function(line){
			console.log("Set Power " + value + " " + line._id)

			dsmSocket.emit("setPower", {
				state: value,
				line: line._id,
			})
		})
	}

	// Print
	$scope.print = function(all){
		performOnSelected(function(line){
			console.log(line, all)
			line.dscAPI.print(all)
		})
	}

	$scope.selectVerein = function(){
		// dsmSocket.emit("getUsersForVerein", {
		// 	vereinID: $scope.selected.verein.id,
		// })
		// if ($scope.selected.schuetze != undefined){
		// 	console.log($scope.selected.schuetze)
		// 	if ($scope.selected.schuetze.vereinID != $scope.selected.verein.id){
		// 		$scope.selected.schuetze = {}
		// 	}
		// }
	}
	dsmSocket.on("setUsersForVerein", function(users){
		$scope.schuetzen = users
	})

	$scope.selectSchuetze = function(){
		var user = {
			firstName: $scope.selected.schuetze.firstName,
			lastName: $scope.selected.schuetze.lastName,
			verein: $scope.selected.verein.name,
			vereinID: $scope.selected.verein.id,
			manschaft: "",
		}

		performOnSelected(function(line){
			if (line.isConnected == true){
				// line.socket.emit("setUser", user)
				console.log(user)
				line.dscAPI.setUser(user)
			}
		})
	}


	$scope.messageType = "danger"
	$scope.showMessage = function(show){
		performOnSelected(function(line){
			if (show == true){
				line.dscAPI.showMessage($scope.messageType, $scope.messageTitle)
			}
			else {
				line.dscAPI.hideMessage()
			}
		})
	}
	$scope.showMessageType = function(type){
		if (type == "sicherheit"){
			performOnSelected(function(line){
				line.dscAPI.showMessage("danger", "Sicherheit")
			})
		}
		else if (type == "pause"){
			performOnSelected(function(line){
				line.dscAPI.showMessage("default", "Pause")
			})
		}
	}


	// Select Helper
	$scope.groupByType = function (item){
		return item.type;
	};
	$scope.groupSetup = {
		theme: "bootstrap"
	};

	function init(){
		$scope.selectVerein()
	}
	init()







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
