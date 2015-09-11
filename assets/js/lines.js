angular.module("dsm.conrtollers.lines", [
	"dsm.services.sockets",
	"dsm.services.filter",
	"ds.services.grafik",

	"ui.select",
	"ngSanitize",
	"ngAnimate",
])
.controller("lines", ["$scope", "lines", "dsmSocket", function ($scope, lines, dsmSocket) {
	$scope.lines = lines

	// Selected lines
	$scope.state = {}

	// Selected values
	$scope.selected = {}

	$scope.schuetzen = schuetzen
	$scope.vereine = vereine
	$scope.selected.verein = vereine[0]


	// Update ui values
	var updateUI = function(forceNameUpdate) {
		$scope.selectedLines = 0
		for (var i in $scope.state){
			if ($scope.state[i] == true){
				$scope.selectedLines++
			}
		}

		$scope.selectedConnectedLines = []
		performOnSelected(function(line){
			if (line.isConnected){
				$scope.selectedConnectedLines.push(line)
			}


			if (line.session){
				if (forceNameUpdate == true){
					$scope.selected.schuetze = {}
					$scope.selected.schuetze.firstName = line.session.user.firstName
					$scope.selected.schuetze.lastName = line.session.user.lastName

					$scope.selected.verein = {}
					$scope.selected.verein.name = line.session.user.verein
					$scope.selected.verein.id = line.session.user.vereinID
				}

				// Format Parts for select
				$scope.parts = []
				for (var id in line.session.disziplin.parts){
					var part = line.session.disziplin.parts[id]
					part.id = id
					$scope.parts.push(part)
				}

				// Set current disziplin
				if (line.config){
					$scope.selected.disziplin = line.config.disziplinen.all[line.session.disziplin._id]
				}

				// Set current part
				$scope.selected.part = line.session.disziplin.parts[line.session.type]

			}


			if (line.config){

				// Set disziplinen for select
				$scope.disziplinen = []
				for (var i in line.config.disziplinen.groups){
					var group = line.config.disziplinen.groups[i]
					for (var key in group.disziplinen){
						var disziplin = line.config.disziplinen.all[group.disziplinen[key]]
						disziplin.type = group.title
						$scope.disziplinen.push(disziplin)
					}

				}

			}
		})
	}


	// toggle selected for line
	$scope.toggle = function(key){
		$scope.state[key] = !$scope.state[key]
		updateUI(true)
	}
	// toggel selection for all
	$scope.toggleAll = function(value){
		$scope.lines.forEach(function(line){
			$scope.state[line._id] = value
		})
		updateUI(true)
	}
	// toggel default all (on)
	$scope.toggleAll(true)



	for (i in lines){
		var line = lines[i]
		setUpSocket(line)
	}
	function setUpSocket(line){
		line.socket.on("setSession", function(session){
			line.session = session
			$scope.selectedPart = session.type
			updateUI()
		})
		line.socket.on("setConfig", function(config){
			line.config = config
			updateUI()
		})
	}



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

	$scope.selectSchuetze = function(){
		var user = {
			firstName: $scope.selected.schuetze.firstName,
			lastName: $scope.selected.schuetze.lastName,
			verein: $scope.selected.verein.name,
			vereinID: $scope.selected.verein._id,
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


	// Select Helper
	$scope.groupByType = function (item){
		return item.type;
	};
	$scope.groupSetup = {
		theme: "bootstrap"
	};

}])






.controller('stand', function ($scope, lines, $timeout) {
	$scope.empty = true
	$scope.stand

	$timeout(function(){
		$scope.$watch('stand', function(value, old){
			$scope.stand = value
			updateUI()
		})
	})


	$('a[data-toggle="tab"]').on('shown.bs.tab', updateUI)
	function updateUI(){
		var socket = $scope.stand.socket

		socket.emit('getSession', {})
		socket.on("setSession", function(session){
			$scope.zoomlevel = session.disziplin.scheibe.defaultZoom

			$scope.scheibe = session.disziplin.scheibe
			$scope.probeecke = session.disziplin.parts[session.type].probeEcke

			$scope.session = session

			if (session.serieHistory.length > 0){
				$scope.activeSerie = session.serieHistory[session.selection.serie]

				$scope.serieSums = []
				for (var i = (session.serieHistory.length<4 ? 0 : session.serieHistory.length-4); i < session.serieHistory.length; i++){
					var sum = 0
					for (var ii in session.serieHistory[i]){
						sum += session.serieHistory[i][ii].ringInt
					}
					$scope.serieSums.push(sum)
				}

				$scope.serie = session.serieHistory[session.selection.serie]
				$scope.selectedshotindex = session.selection.shot
				$scope.activeShot = session.serieHistory[session.selection.serie][session.selection.shot]
				$scope.empty = false

				if ($scope.serie != undefined && $scope.serie.length != 0) {
					var ringInt = $scope.serie[session.selection.shot].ringInt
					var ring = $scope.scheibe.ringe[$scope.scheibe.ringe.length - ringInt]

					if (ring){
						$scope.zoomlevel = ring.zoom
					}
					else if (ringInt == 0){
						$scope.zoomlevel = scheibe.minZoom
					}
				}
			}
			else {
				$scope.serieSums = []
				$scope.activeShot = undefined
				$scope.serie = []
				$scope.selectedshotindex = -1
				$scope.empty = true
			}
		})
	}
	$scope.updateUI = updateUI

	return {
		scope: {
			stand: '=',
		},
	}


})
