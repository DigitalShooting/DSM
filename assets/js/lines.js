angular.module("dsm.controllers.stände.overview", [
	"ui.select",
	"ngSanitize",

	"dsm.services.filter",
])
.controller("stände", ["$scope", "lines", "dsmSocket", function ($scope, lines, dsmSocket) {
	$scope.staende = lines

	// Selected stände
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

		performOnSelected(function(stand){

			if (stand.session){

				// Format Parts for select
				$scope.parts = []
				for (var id in stand.session.disziplin.parts){
					var part = stand.session.disziplin.parts[id]
					part.id = id
					$scope.parts.push(part)
				}

				// Set current disziplin
				if (stand.config){
					$scope.selected.disziplin = stand.config.disziplinen.all[stand.session.disziplin._id]
				}

				// Set current part
				$scope.selected.part = stand.session.disziplin.parts[stand.session.type]

			}


			if (stand.config){

				// Set disziplinen for select
				$scope.disziplinen = []
				for (var i in stand.config.disziplinen.groups){
					var group = stand.config.disziplinen.groups[i]
					for (var key in group.disziplinen){
						var disziplin = stand.config.disziplinen.all[group.disziplinen[key]]
						disziplin.type = group.title
						$scope.disziplinen.push(disziplin)
					}

				}

			}
		})
	}


	// toggle selected for stand
	$scope.toggle = function(key){
		$scope.state[key] = !$scope.state[key]
		updateUI()
	}
	// toggel selection for all
	$scope.toggleAll = function(value){
		$scope.staende.forEach(function(stand){
			$scope.state[stand._id] = value
		})
		updateUI()
	}
	// toggel default all (on)
	$scope.toggleAll(true)



	for (i in lines){
		var stand = lines[i]
		setUpSocket(stand)
	}
	function setUpSocket(stand){
		stand.socket.on("setSession", function(session){
			stand.session = session
			$scope.selectedPart = session.type
			updateUI()
		})
		stand.socket.on("setConfig", function(config){
			stand.config = config
			updateUI()
		})
	}



	// Performs method on all selected clients
	function performOnSelected(callback){
		$scope.staende.forEach(function(stand){
			if($scope.state[stand._id] == true){
				if (stand.isConnected == true){
					callback(stand)
				}
			}
		})
	}




	// Send selected disziplin
	$scope.selectDisziplin = function(){
		performOnSelected(function(stand){
			stand.socket.emit("setDisziplin", $scope.selected.disziplin._id)
		})
	}

	// Send selected part
	$scope.selectPart = function(){
		performOnSelected(function(stand){
			stand.socket.emit("switchToPart", $scope.selected.part.id)
		})
	}

	// Set power for line
	$scope.setPower = function(value){
		performOnSelected(function(stand){
			console.log("Set Power " + value + " " + stand._id)

			dsmSocket.emit("setPower", {
				state: value,
				stand: stand._id,
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
			vorname: $scope.selected.schuetze.vorname,
			name: $scope.selected.schuetze.name,
			verein: $scope.selected.verein.name,
			manschaft: "",
		}

		performOnSelected(function(stand){
			stand.socket.emit("setUser", user)
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




angular.module("staende", [
	"dsm.services.sockets",
	"dsm.controllers.stände.overview",

	"ngAnimate",
])
