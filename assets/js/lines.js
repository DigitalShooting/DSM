angular.module("lines", [
	"dsm.services.sockets",
	"dsm.services.filter",

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
	var updateUI = function() {
		$scope.selectedLines = 0
		for (var i in $scope.state){
			if ($scope.state[i] == true){
				$scope.selectedLines++
			}
		}

		performOnSelected(function(line){

			if (line.session){
				$scope.selected.schuetze = {}
				$scope.selected.schuetze.firstName = line.session.user.firstName
				$scope.selected.schuetze.lastName = line.session.user.lastName

				$scope.selected.verein = {}
				$scope.selected.verein.name = line.session.user.verein
				$scope.selected.verein._id = line.session.user.vereinID

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
		updateUI()
	}
	// toggel selection for all
	$scope.toggleAll = function(value){
		$scope.lines.forEach(function(line){
			$scope.state[line._id] = value
		})
		updateUI()
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
				line.socket.emit("setDisziplin", $scope.selected.disziplin._id)
			}
		})
	}

	// Send selected part
	$scope.selectPart = function(){
		performOnSelected(function(line){
			if (line.isConnected == true){
				line.socket.emit("switchToPart", $scope.selected.part.id)
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
	$scope.print = function(type){
		if (type == "all"){

		}
		else if (type == "current"){

		}
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
				line.socket.emit("setUser", user)
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
