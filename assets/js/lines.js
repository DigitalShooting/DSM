angular.module("dsm.lines", [
	"dsm.services.sockets",
	"dsm.services.filter",
	"ds.services.grafik",

	"ui.select",
	"restangular",
])

/**
 Manages the selected lines.
 Calles "didChangeSelectedLines" after each change.
 */
.factory("SelectedLines", function ($rootScope, Lines) {
	var linesSelected = {};
	var linesSelectedCount = 0;

	function didChangeSelectedLines() {
		updateSelectedCount();
		$rootScope.$broadcast('didChangeSelectedLines');
		$rootScope.$broadcast('didChangeSelectedDisziplin');

		$rootScope.$broadcast('didChangeSelectedUser');
	}

	function updateSelectedCount() {
		linesSelectedCount = 0;
		for (var id in linesSelected) {
			if (linesSelected[id] == true) {
				linesSelectedCount++;
			}
		}
	}

	// Update didChangeSelectedDisziplin on each change of selected lines and data
	$rootScope.$on("didSetLineData", function () {
		$rootScope.$broadcast('didChangeSelectedDisziplin');
	});
	$rootScope.$on("didChangeLines", function () {
		$rootScope.$broadcast('didChangeSelectedDisziplin');
	});



	return {
		/**
		 Return object with <lineID>: <online>
		 */
		getSelectedLines: function() {
			return linesSelected;
		},

		/**
		 Number of selected lines
		 */
		getLinesSelectedCount: function() {
			return linesSelectedCount;
		},

		/**
		 Set selected state for given lineID
		 */
		selectLine: function(id, value) {
			linesSelected[id] = value;
			didChangeSelectedLines();
		},

		/**
		 Set selected state for all lines
		 */
		selectAllLines: function(value) {
			var lines = Lines.getLines();
			for (var id in lines) {
				linesSelected[id] = value;
			}
			didChangeSelectedLines();
		},

		/**
		 Invert selected state for given lineID
		 */
		toggleLine: function(id) {
			this.selectLine(id, !linesSelected[id]);
		},

		/**
		 Perform given callback on all lines wich match the given lineState

		 callback(lineID)    Gets called for each lineID wihch match lineState
		 lineSate            Var to compare with line.online
		 */
		performOnSelected: function(callback, lineState){
			var lines = Lines.getLines();
			for (var id in linesSelected){
				if (linesSelected[id] == true){
					var line = lines[id];
					if (line != null && (line.online == lineState)){
						callback(id);
					}
				}
			}
		},

		/**
		 Returns an object with "disziplin" and "part".
		 If each selected line has the same disziplin/ part, these values are set.
		 Otherwise null.
		 */
		getSelectedDisziplin: function() {
			var lines = Lines.getLines();
			var disziplin = null;
			var partType = null;
			var part = null;
			var noPart = false;
			for (var id in linesSelected){
				if (linesSelected[id] == true){
					var line = lines[id];
					if (line != null && (line.online == true)){
						var data = line.cache.setData;
						if (disziplin == null || data.disziplin._id == disziplin._id) {
							disziplin = data.disziplin;
							if (noPart == false && (partType == null || partType == data.sessionParts[data.sessionIndex].type)) {
								partType = data.sessionParts[data.sessionIndex].type;
								part = data.disziplin.parts[partType];
							}
							else {
								noPart = true;
								part = null;
							}
						}
						else {
							disziplin = null;
							part = null;
							break;
						}
					}
				}
			}
			return {
				disziplin: disziplin,
				part: part,
			};
		},

		/**
		 If only one line is selected we return its user object, otherwise null.
		 */
		getSelectedUser: function() {
			if (linesSelectedCount != 1) {
				return null;
			}
			else {
				var lines = Lines.getLines();
				for (var id in linesSelected){
					if (linesSelected[id] == true){
						var line = lines[id];
						if (line != null && (line.online == true)){
							return line.cache.setData.user;
						}
					}
				}
			}
		},

		/**
		 Get an object with all user objects for each online and selected line.
		 */
		getAllSelectedUsers: function() {
			var users = {};
			var lines = Lines.getLines();
			for (var id in linesSelected){
				if (linesSelected[id] == true){
					var line = lines[id];
					if (line != null && (line.online == true)){
						users[id] = line.cache.setData.user;
					}
				}
			}
			return users;
		},

		/**
		 True if min one selected line is online
		 */
		hasOnlineSelectedLine: function() {
			var lines = Lines.getLines();
			for (var id in linesSelected){
				if (linesSelected[id] == true){
					var line = lines[id];
					if (line != null && (line.online == true)){
						return true;
					}
				}
			}
			return false;
		},

	};
})

/**
 Listen for changes in the online lines form DSC-Gateway.
 Calles "didChangeLines" on rootScope after each lines status change,
 and "didSetLineData" when we receve line data.
 */
.factory("Lines", function ($rootScope, gatewaySocket) {

	function triggerUpdate() {
		$rootScope.$broadcast('didChangeLines');
	}

	// -- store lines recived from DSC-Gateway --
	var lines = [];

	gatewaySocket.emit("getLines", {});

	// listen to DSC-Gateway updates
	gatewaySocket.on("disconnect", function(data){
		lines = data.lines; // TODO???
		triggerUpdate();
	});
	gatewaySocket.on("onlineLines", function(data){
		lines = data.lines;
		triggerUpdate();
	});
	gatewaySocket.on("setData", function(data){
		lines[data.line].cache.setData = data.data;
		$rootScope.$broadcast('didSetLineData');
	});

	return {
		/**
		 Return all lines (object form DSC-Gateway)
		 */
		getLines: function () {
			return lines;
		},
	};
})

/**
 Main Lines Controller, manages the count of selected lines.
 */
.controller("controller_lines", function ($scope, SelectedLines) {
	$scope.linesSelectedCount = 0;
	$scope.hasOnlineSelectedLine = false;

	$scope.store = {
		dashboardMode: "database",
	};

	onDidChangeSelectedLines();
	$scope.$on("didChangeSelectedLines", function () {
		onDidChangeSelectedLines();
	});
	function onDidChangeSelectedLines() {
		$scope.linesSelectedCount = SelectedLines.getLinesSelectedCount();
		$scope.hasOnlineSelectedLine = SelectedLines.hasOnlineSelectedLine();
	}
})

/**
 Power on and off selected lines
 */
.controller("controller_lines_power", function ($scope, SelectedLines, gatewaySocket) {

	/**
	 Call setPower for all selected lines with state !power,
	 so we can power on offline lines, and power off online lines
	 */
	$scope.setPower = function(power) {
		SelectedLines.performOnSelected(function(id){
			gatewaySocket.api.setPower(id, power);
		}, !power);
	};

})

/**
 Control the shown message on the lines (Sicherheit, Pause, ...)
 */
.controller("controller_lines_message", function ($scope, SelectedLines, gatewaySocket) {

	/**
	 Show message

	 kind       Type of message "danger"/ "default"/ ... (bootstrap types)
	 message    Message text to show
	 */
	$scope.showMessage = function(kind, message) {
		SelectedLines.performOnSelected(function(id) {
			gatewaySocket.api.showMessage(id, kind, message);
		}, true);
	};

	/**
	 Hide message
	 */
	$scope.hideMessage = function() {
		SelectedLines.performOnSelected(function(id) {
			gatewaySocket.api.hideMessage(id);
		}, true);
	};

})

/**
 Print selected lines and open log
 */
.controller("controller_lines_print", function ($scope, Lines, SelectedLines, gatewaySocket) {

	/**
	 Trigger print for selected lines.
	 */
	$scope.print = function() {
		SelectedLines.performOnSelected(function(id) {
			gatewaySocket.api.print(id);
		}, true);
	};

	/**
	 Open line site for each selected line.
	 */
	$scope.openLine = function(){
		SelectedLines.performOnSelected(function(id){
			var lines = Lines.getLines();
			var line = lines[id];
			var url = "http://" + line.ip + ":" + line.port;
			window.open(url, '_blank');
			// TODO add auth
		}, true);
	};

	/**
	 Open line log for each selected line.
	 */
	$scope.openLog = function(){
		SelectedLines.performOnSelected(function(id){
			var lines = Lines.getLines();
			var line = lines[id];
			var url = "http://" + line.ip + ":" + line.port + "/log";
			window.open(url, '_blank');
		}, true);
	};

})

/**
 Manage disziplin selection
 */
.controller("controller_lines_disziplinen", function ($scope, SelectedLines, gatewaySocket, Restangular) {

	$scope.disziplinen = [];
	$scope.parts = [];

	$scope.selected = {
		disziplin: null,
		part: null,
	};

	didChangeSelectedDisziplin();
	$scope.$on("didChangeSelectedDisziplin", function () {
		didChangeSelectedDisziplin();
	});
	function didChangeSelectedDisziplin() {
		var values = SelectedLines.getSelectedDisziplin();
		$scope.selected.disziplin = values.disziplin;
		$scope.selected.part = values.part;
		loadParts();
	}

	// Store disziplinen once
	Restangular.all("/disziplinen").getList({
	}).then(function(disziplinen) {
		$scope.disziplinen = disziplinen;
	});


	/**
	 Trigger each selected line with current selected.disziplin and update parts.
	 */
	$scope.didSelectDisziplin = function() {
		if ($scope.selected.disziplin != null) {
			loadParts();
			SelectedLines.performOnSelected(function(id){
				gatewaySocket.api.setDisziplin(id, $scope.selected.disziplin._id);
			}, true);
		}
	};

	/**
	 Trigger each selected line with current selected.part.
	 */
	$scope.didSelectPart = function() {
		if ($scope.selected.part != null) {
			SelectedLines.performOnSelected(function(id){
				gatewaySocket.api.setPart(id, $scope.selected.part.id);
			}, true);
		}
	};

	/**
	 Trigger set new target on each selected line.
	 */
	$scope.setNewTarget = function() {
		SelectedLines.performOnSelected(function(id){
			gatewaySocket.api.setNewTarget(id);
		}, true);
	};

	/**
	 Trigger reset on each selected line to current disziplin.
	 */
	$scope.resetLine = function() {
		SelectedLines.performOnSelected(function(id){
			gatewaySocket.api.setDisziplin(id, $scope.selected.disziplin._id);
		}, true);
	};



	/**
	 Load available parts for disziplin
	 */
	function loadParts(){
		if ($scope.selected.disziplin != null) {
			$scope.parts = [];
			for (var id in $scope.selected.disziplin.parts){
				var part = $scope.selected.disziplin.parts[id];
				part.id = id;
				$scope.parts.push(part);
			}
		}
	}

	$scope.groupByType = function (item){
		return item.type;
	};

})

/**
 Set the user/ verein data manual
 */
.controller("controller_lines_manual_user", function ($scope, SelectedLines, gatewaySocket) {
	$scope.user = null;

	var timer;
	var focus = false;
	$scope.focus = function(value) {
		if (value) {
			clearTimeout(timer);
			focus = true;
		}
		else {
			timer = setTimeout(function(){
				focus = false;
				update();
			}, 10000);
		}
	};

	onDidSetLineData();
	$scope.$on("didSetLineData", function() {
		onDidSetLineData();
	});
	function onDidSetLineData() {
		if (focus == false) {
			update();
		}
	}

	onDidChangeSelectedUser();
	$scope.$on("didChangeSelectedUser", function () {
		onDidChangeSelectedUser();
	});
	function onDidChangeSelectedUser() {
		focus = false;
		update();
	}

	function update() {
		$scope.user = SelectedLines.getSelectedUser();
	}

	$scope.setCustomUser = function() {
		if ($scope.user != null) {
			SelectedLines.performOnSelected(function(id){
				gatewaySocket.api.setUser(id, $scope.user);
			}, true);
		}
	};
})

/**
 Set team manual
 */
.controller("controller_lines_manual_team", function ($scope, SelectedLines, gatewaySocket) {
	var users = null;

	$scope.selected = {};

	var timer;
	var focus = false;
	$scope.focus = function(value) {
		if (value) {
			clearTimeout(timer);
			focus = true;
		}
		else {
			timer = setTimeout(function(){
				focus = false;
				update();
			}, 10000);
		}
	};

	onDidSetLineData();
	$scope.$on("didSetLineData", function() {
		onDidSetLineData();
	});
	function onDidSetLineData() {
		if (focus == false) {
			update();
		}
	}

	onDidChangeSelectedUser();
	$scope.$on("didChangeSelectedUser", function () {
		onDidChangeSelectedUser();
	});
	function onDidChangeSelectedUser() {
		focus = false;
		update();
	}

	function update() {
		users = SelectedLines.getAllSelectedUsers();
		var manschaft = null;
		for (var i in users) {
			if (manschaft == null) {
				manschaft = {
					name: users[i].manschaft,
					anzahlSchuetzen: users[i].manschaftAnzahlSchuetzen,
				};
			}
			else if (users[i].manschaft != manschaft.name) {
				manschaft = null;
			}
		}
		$scope.selected.manschaft = manschaft;
	}

	$scope.setCustomUser = function() {
		if ($scope.selected.manschaft != null) {
			SelectedLines.performOnSelected(function(id){
				var user = users[id];
				if (user != null) {
					user.manschaft = $scope.selected.manschaft.name;
					user.manschaftAnzahlSchuetzen = $scope.selected.manschaft.anzahlSchuetzen;
					gatewaySocket.api.setUser(id, user);
				}
			}, true);
		}
	};

})

/**
 Set user/ verein form database
 */
.controller("controller_lines_database_user", function ($scope, SelectedLines, gatewaySocket, Restangular) {

	$scope.user = null;

	$scope.selected = {};

	var timer;
	var focus = false;
	$scope.focus = function(value) {
		if (value) {
			clearTimeout(timer);
			focus = true;
		}
		else {
			timer = setTimeout(function(){
				focus = false;
				update();
			}, 10000);
		}
	};

	onDidSetLineData();
	$scope.$on("didSetLineData", function() {
		onDidSetLineData();
	});
	function onDidSetLineData() {
		if (focus == false) {
			update();
		}
	}

	onDidChangeSelectedUser();
	$scope.$on("didChangeSelectedUser", function () {
		onDidChangeSelectedUser();
	});
	function onDidChangeSelectedUser() {
		focus = false;
		update();
	}

	function update() {
		$scope.user = SelectedLines.getSelectedUser();
		if ($scope.user != null) {

			$scope.selected.user = {
				_set: true,
				firstName: $scope.user.firstName,
				lastName: $scope.user.lastName,
				id: $scope.user.userID,
			};

			if ($scope.user.verein != null && $scope.user.verein != "") {
				$scope.selected.verein = {
					_set: true,
					name: $scope.user.verein,
					id: $scope.user.vereinID,
				};
				$scope.selected.user.vereinID = $scope.user.vereinID;
			}
			else {
				$scope.selected.verein = null;
			}
		}
	}


	$scope.$watch("selected.user", function() {
		if ($scope.selected.user != null && typeof $scope.selected.user != "string" ) {
			if ($scope.selected.user._set == true) {
				return;
			}

			$scope.selected.verein = {
				name: $scope.selected.user.verein,
				id: $scope.selected.user.vereinID,
			};

			if ($scope.user == null || $scope.selected.user.id != $scope.user.userID) {
				setCurrentInfo();
			}
		}
	});



	function setCurrentInfo() {
		if ($scope.selected.user != null) {
			$scope.user.firstName = $scope.selected.user.firstName;
			$scope.user.lastName = $scope.selected.user.lastName;
			$scope.user.id = $scope.selected.user.id;
		}
		else {
			$scope.user.firstName = "Gast";
			$scope.user.lastName = "";
			$scope.user.id = "";
		}

		if ($scope.selected.verein != null) {
			$scope.user.verein = $scope.selected.verein.name;
			$scope.user.vereinID = $scope.selected.verein.id;
		}
		else {
			$scope.user.verein = "";
			$scope.user.vereinID = "";
		}

		SelectedLines.performOnSelected(function(id){
			gatewaySocket.api.setUser(id, $scope.user);
		}, true);
	}



	$scope.getUsers = function(serachString){
		var query = {
			search: serachString,
			limit: 100,
		};
		if ($scope.selected.verein != null && typeof $scope.selected.verein != "string"){
			query.equals_vereinID = $scope.selected.verein.id;
		}
		return Restangular.one('/user').get(query).then(function(users) {
			return users;
		});
	};
	$scope.getUserTitle = function(user){
		if (user != null){
			return user.firstName + " " + user.lastName;
		}
		return "";
	};
	$scope.getUserSearchTitle = function(user){
		var string = "";
		if (user != null){
			string = user.firstName + " " + user.lastName;
		}
		if ($scope.selected.verein == null || typeof $scope.selected.verein == "string"){
			string += " (" + user.verein + ")";
		}
		return string;
	};



	$scope.$watch("selected.verein", function() {
		if ($scope.selected.verein != null && typeof $scope.selected.verein != "string" && $scope.selected.user != null){
			if ($scope.selected.verein.id != $scope.selected.user.vereinID){
				$scope.selected.user = null;
			}
		}
	});

	$scope.getVereine = function(serachString) {
		return Restangular.one('/verein').get({
			search: serachString,
			limit: 1000,
		}).then(function(vereine) {
			return vereine;
		});
	};



	$scope.resetVerein = function() {
		$scope.selected.verein = null;
		$scope.selected.user = null;
		$scope.selected.manschaft = null;
		setCurrentInfo();
	};

	$scope.resetUser = function() {
		$scope.selected.user = null;
		setCurrentInfo();
	};
})

/**
 Set team from database
 */
.controller("controller_lines_database_team", function ($scope, SelectedLines, gatewaySocket, Restangular) {

	var users = null;

	$scope.selected = {};

	var timer;
	var focus = false;
	$scope.focus = function(value) {
		if (value) {
			clearTimeout(timer);
			focus = true;
		}
		else {
			timer = setTimeout(function(){
				focus = false;
				update();
			}, 10000);
		}
	};

	onDidSetLineData();
	$scope.$on("didSetLineData", function() {
		onDidSetLineData();
	});
	function onDidSetLineData() {
		if (focus == false) {
			update();
		}
	}

	onDidChangeSelectedUser();
	$scope.$on("didChangeSelectedUser", function () {
		onDidChangeSelectedUser();
	});
	function onDidChangeSelectedUser() {
		focus = false;
		update();
	}

	function update() {
		users = SelectedLines.getAllSelectedUsers();
		var manschaft = null;
		for (var i in users) {
			if (manschaft == null) {
				manschaft = {
					name: users[i].manschaft,
					anzahlSchuetzen: users[i].manschaftAnzahlSchuetzen,
				};
			}
			else if (users[i].manschaft != manschaft.name) {
				manschaft = null;
			}
		}
		if (manschaft != null && manschaft.name != "") {
			$scope.selected.manschaft = manschaft;
		}
		else {
			$scope.selected.manschaft = null;
		}
	}


	$scope.didSelectTeam = function() {
		if ($scope.selected.manschaft != null && typeof $scope.selected.manschaft != "string") {
			setCurrentInfo();
		}
	};

	function setCurrentInfo() {
		var manschaft = $scope.selected.manschaft;
		if (manschaft == null) {
			manschaft = {
				name: "",
			};
		}

		if (manschaft != null) {
			SelectedLines.performOnSelected(function(id){
				var user = users[id];
				if (user != null) {
					user.manschaft = manschaft.name;
					user.manschaftAnzahlSchuetzen = manschaft.anzahlSchuetzen;
					gatewaySocket.api.setUser(id, user);
				}
			}, true);
		}
	}



	Restangular.all("/manschaft").getList({
	}).then(function(manschaften) {
		$scope.manschaften = manschaften;
	});


	$scope.resetTeam = function() {
		$scope.selected.manschaft = null;
		setCurrentInfo();
	};


})

/**
 Manage the selection of lines
 */
.controller("controller_lines_selected", function ($scope, Lines, SelectedLines) {

	$scope.lines = {};
	onDidChangeLines();
	$scope.$on("didChangeLines", function () {
		onDidChangeLines();
	});
	function onDidChangeLines() {
		$scope.lines = Lines.getLines();
	}

	$scope.selectedLines = {};
	onDidChangeSelectedLines();
	$scope.$on("didChangeSelectedLines", function () {
		onDidChangeSelectedLines();
	});
	function onDidChangeSelectedLines() {
		$scope.selectedLines = SelectedLines.getSelectedLines();
	}


	$scope.selectLine = function(id, value){
		SelectedLines.selectLine(id, value);
	};

	$scope.toggleLine = function(id){
		SelectedLines.toggleLine(id);
	};

	$scope.selectAllLines = function(value){
		SelectedLines.selectAllLines(value);
	};

});
