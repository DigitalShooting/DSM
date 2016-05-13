angular.module("dsm.lines", [
	"dsm.services.sockets",
	"dsm.services.filter",
	"ds.services.grafik",

	"ui.select",
	"restangular",
])
.controller("LinesController", function ($scope, $cookies, gatewaySocket, Restangular) {
	$scope.store = {
		linesSelected: {},
		linesSelectedCount: 0,
	};

	$scope.selected = {};

	var resetDBUser = function(){
		$scope.selected.user = null;
		$scope.selected.verein = null;
	};
	var resetRWKUser = function(){
		$scope.selected.rwk = null;
		$scope.selected.rwkUser = null;
	};

	// Manual user
	var resetManualUser = function(){
		$scope.manualUser = {
			firstName: "",
			lastName: "",
			verein: "",
			manschaft: "",
		};
	};
	resetManualUser();


	$scope.dataCache = {};

	Restangular.all("/api/disziplinen").getList({
	}).then(function(disziplinen) {
		$scope.disziplinen = disziplinen;
	});


	// -- store lines recived from DSC-Gateway --
	$scope.lines = [];
	gatewaySocket.emit("getLines", {});

	// listen to DSC-Gateway updates
	gatewaySocket.on("disconnect", function(data){
		$scope.lines = data.lines;
	});
	gatewaySocket.on("onlineLines", function(data){
		$scope.lines = data.lines;

		$scope.didToggle();
	});
	gatewaySocket.on("setData", function(data){
		$scope.dataCache[data.line] = data.data;
		updateUI(false); // TODO optimize
	});
	// --------------------------------------------




	function updateUI(force){
		if (force === true){
			resetDBUser();
			resetRWKUser();
			resetManualUser();
		}

		var lineID;
		for (var id in $scope.store.linesSelected){
			if ($scope.store.linesSelected[id] === true){
				var line = $scope.lines[id];
				if (line !== undefined && line.online === true){
					lineID = id;
					break;
				}
			}
		}

		if (lineID !== undefined){
			var data = $scope.dataCache[lineID];
			if (data === undefined){
				return;
			}

			var session = data.sessionParts[data.sessionIndex];
			if (session === undefined){
				return;
			}


			if (data.user.rwkID !== undefined){
				$scope.selected.rwkUser = data.user;
				Restangular.one('/api/rwk/'+data.user.rwkID).get({
					limit: 1,
				}).then(function(rwk) {
					$scope.selected.rwk = rwk;
				});
			}
			else if (data.user.id === "" || data.user.id === null || data.user.id === undefined) { // if no id, set to manual user
				$scope.manualUser = data.user;
			}
			else { // if id, use database
				if (typeof $scope.selected.user != "string"){
					$scope.selected.user = {
						firstName: data.user.firstName,
						lastName: data.user.lastName,
						vereinID: data.user.vereinID,
					};
				}
				if (typeof $scope.selected.verein !== "string" && data.user.verein !== undefined && data.user.vereinID !== undefined){
					$scope.selected.verein = {
						name: data.user.verein,
						id: data.user.vereinID,
					};
				}
			}


			if (typeof $scope.selected.disziplin != "string"){
				$scope.selected.disziplin = data.disziplin;

				loadParts();

				if (typeof $scope.selected.part != "string"){
					for (var i in $scope.parts){
						var part = $scope.parts[i];
						if (part.id == session.type){
							$scope.selected.part = part;
							break;
						}
					}
				}
			}
		}
		else {
			resetDBUser();
			resetRWKUser();
			resetManualUser();
		}
	}





	// ----- toggle selected for line -------
	$scope.toggle = function(id, forceSet){
		if (forceSet !== undefined){
			$scope.store.linesSelected[id] = forceSet;
		}
		else {
			$scope.store.linesSelected[id] = !$scope.store.linesSelected[id];
		}

		$scope.store.linesSelectedCount = 0;
		for (id in $scope.store.linesSelected) {
			if ($scope.store.linesSelected[id] === true) {
				$scope.store.linesSelectedCount++;
			}
		}

		writeToCookie();
	};
	// toggel selection for all
	$scope.toggleAll = function(value){
		for(var id in $scope.lines){
			$scope.toggle(id, value);
		}
	};
	$scope.didToggle = function(){
		updateUI(true);

		performOnSelected(function(id){
			gatewaySocket.api.getData(id);
		});
	};
	// ----------------------------------------







	// Performs method on all selected clients
	function performOnSelected(callback, online){
		for (var id in $scope.store.linesSelected){
			if ($scope.store.linesSelected[id] === true){
				var line = $scope.lines[id];
				if (line !== undefined && (line.online === true || online === false)){
					callback(id);
				}
			}
		}
	}



	// All funcs, to update dscs
	$scope.actions = {
		resetLine: function(){
			performOnSelected(function(id){
				gatewaySocket.api.setDisziplin(id, $scope.selected.disziplin._id);
			});
			// TODO reset name
		},
		selectDisziplin: function(){
			loadParts();
			performOnSelected(function(id){
				gatewaySocket.api.setDisziplin(id, $scope.selected.disziplin._id);
			});
		},
		selectPart: function(){
			performOnSelected(function(id){
				gatewaySocket.api.setPart(id, $scope.selected.part.id);
			});
		},
		print: function(){
			performOnSelected(function(id){
				gatewaySocket.api.print(id);
			});
		},
		newTarget: function(){
			performOnSelected(function(id){
				gatewaySocket.api.setNewTarget(id);
			});
		},
		showMessage: function(type, title){
			performOnSelected(function(id){
				gatewaySocket.api.showMessage(id, type, title);
			});
		},
		hideMessage: function(){
			performOnSelected(function(id){
				gatewaySocket.api.hideMessage(id);
			});
		},
		shutdown: function(){
			performOnSelected(function(id){
				gatewaySocket.api.setPower(id, false);
			});
		},
		wakeonlan: function(){
			performOnSelected(function(id){
				gatewaySocket.api.setPower(id, true);
			}, false);
		},
		resetUser: function(){
			performOnSelected(function(id){
				gatewaySocket.api.setUser(id, {
					firstName: "Gast",
					lastName: "",
					verein: "",
					manschaft: "",
				});
			});
			resetDBUser();
			resetRWKUser();
			resetManualUser();
		},
		setUser: function(){
			if ($scope.selected.user !== undefined && $scope.selected.user.firstName !== undefined){

				// reset maunal user
				resetManualUser();
				resetRWKUser();

				performOnSelected(function(id){
					gatewaySocket.api.setUser(id, {
						id: $scope.selected.user.id,
						firstName: $scope.selected.user.firstName,
						lastName: $scope.selected.user.lastName,
						verein: $scope.selected.user.verein,
						vereinID: $scope.selected.user.vereinID,
						manschaft: "",
					});
				});
			}
		},
		setBareUser: function(user){
			performOnSelected(function(id){
				gatewaySocket.api.setUser(id, user);
			});
		},
		setCustomUser: function(){

			resetDBUser();
			resetRWKUser();

			performOnSelected(function(id){
				gatewaySocket.api.setUser(id, {
					id: "",
					firstName: $scope.manualUser.firstName,
					lastName: $scope.manualUser.lastName,
					verein: $scope.manualUser.verein,
					vereinID: "",
					manschaft: $scope.manualUser.manschaft,
				});
			});
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



	// Load available parts for disziplin
	function loadParts(){
		// Update Parts (TODO move to function)
		$scope.parts = [];
		for (var id in $scope.selected.disziplin.parts){
			var part = $scope.selected.disziplin.parts[id];
			part.id = id;
			$scope.parts.push(part);
		}
	}






	$scope.selectUser = function(){
		if ($scope.selected.user !== undefined && $scope.selected.user !== null && $scope.selected.user.vereinID !== undefined){
			$scope.selected.verein = {
				id: $scope.selected.user.vereinID,
				name: $scope.selected.user.verein,
			};
		}
		$scope.actions.setUser();
	};

	$scope.getUsers = function(serachString){
		var query = {
			search: serachString,
			limit: 100,
		};

		if ($scope.selected.verein !== undefined && $scope.selected.verein !== null && typeof $scope.selected.verein !== "string"){
			query.equals_vereinID = $scope.selected.verein.id;
		}
		return Restangular.one('/api/user').get(query).then(function(users) {
			return users;
		});
	};
	$scope.getUserTitle = function(user){
		if (user !== undefined && user !== null){
			return user.firstName + " " + user.lastName;
		}
		return "";
	};
	$scope.getUserSearchTitle = function(user){
		var string = "";
		if (user !== undefined){
			string = user.firstName + " " + user.lastName;
		}
		if ($scope.selected.verein === undefined || $scope.selected.verein === null || typeof $scope.selected.verein === "string"){
			string += " (" + user.verein + ")";
		}
		return string;
	};



	$scope.$watch("selected.verein", function() {
		if ($scope.selected.verein !== undefined && $scope.selected.verein !== null && typeof $scope.selected.verein !== "string" && $scope.selected.user !== undefined && $scope.selected.user !== null){
			if ($scope.selected.verein.id != $scope.selected.user.vereinID){
				$scope.selected.user = null;
			}
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



	$scope.getRWKTitle = function(rwk){
		if (rwk !== undefined && rwk !== null){
			return rwk.heimVerein + " " + rwk.heim + " - " + rwk.gastVerein + " " + rwk.gast;
		}
		return "";
	};
	$scope.getRWK = function(serachString) {
		return Restangular.one('/api/rwk').get({
			search: serachString,
			limit: 1000,
		}).then(function(vereine) {
			return vereine;
		});
	};





	$scope.$watch("selected.rwkUser", function() {
		if ($scope.selected.rwkUser !== undefined && $scope.selected.rwkUser !== null && typeof $scope.selected.rwkUser !== "string"){

			resetDBUser();
			resetManualUser();

			$scope.actions.setBareUser({
				firstName: $scope.selected.rwkUser.firstName,
				lastName: $scope.selected.rwkUser.lastName,
				id: $scope.selected.rwkUser.id,
				verein: $scope.selected.rwkUser.verein,
				manschaft: $scope.selected.rwkUser.manschaft,
				rwkID: $scope.selected.rwk.id,
			});
		}
	});
	$scope.getRWKUserTitle = function(user){
		if (user !== undefined && user !== null){
			return user.firstName + " " + user.lastName + " (" + user.verein + ")";
		}
		return "";
	};
	$scope.getRWKUsers = function(serachString) {
		return Restangular.one('/api/manschaft/' + $scope.selected.rwk.manschaftHeim + "/member").get({
			search: serachString,
			limit: 1000,
		}).then(function(usersHeim) {
			return Restangular.one('/api/manschaft/' + $scope.selected.rwk.manschaftGast + "/member").get({
				search: serachString,
				limit: 1000,
			}).then(function(usersGast) {
				return usersHeim.concat(usersGast);
			});
		});
	};




	$scope.groupByType = function (item){
		return item.type;
	};




	// Cookie stuff
	var cookieData = $cookies.getObject('LinesController');
	if (cookieData !== undefined){
		$scope.store = cookieData;
	}
	function writeToCookie(){
		$cookies.putObject('LinesController', $scope.store, {});
	}
});
