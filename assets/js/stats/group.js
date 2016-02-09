var app = angular.module("dsm.stats.group", [
	"dsm.services.sockets",
	"restangular",
	"ui.bootstrap",
	"ngCookies",
]);

// StatsGroupController
// Lists session groups and perfor search and order
app.controller("StatsGroupController", function($scope, gatewaySocket, Restangular, $uibModal, $cookies) {
	$scope.store = {
		itemsPerPage: 20, // items per page
		selectedOrder: { // Ordering Infos
			field: "lastName",
			dir: false,
		},
		search: "", // Search Property
	};

	$scope.$watch('currentPage', function() {
		reload(); // reload on page change
		writeToCookie();
	});
	$scope.$watch('store.search', function() {
		reload(); // reload on each type
		writeToCookie();
	});
	$scope.$watch('store.itemsPerPage', function() {
		reload(); // reload on change
		writeToCookie();
	});

	// items to display (on all pages)
	$scope.totalItems = 0;
	// currend selected page
	$scope.currentPage = 1;
	// pagination pages listed
	$scope.paginationMaxSize = 10;

	// Reload total item count and groups
	function reload(){
		Restangular.one('/api/group/info').get({
			search: $scope.store.search,
		}).then(function(info) {
			$scope.totalItems = info.count;
		});
		Restangular.all('/api/group').getList({
			search: $scope.store.search,
			limit: $scope.store.itemsPerPage,
			page: $scope.currentPage-1,
			order: $scope.store.selectedOrder.field,
			orderDir: $scope.store.selectedOrder.dir == true ? "DESC" : "ASC",
		}).then(function(sessionGroups) {
			$scope.sessionGroups = sessionGroups;
		});
	}

	gatewaySocket.on("setSession", function(data) {
		setTimeout(reload, 2500);
	});

	// open edit for groups
	$scope.editEntry = function(group){
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'modalEditingOverlay.html',
			controller: 'StatsGroupEditController',
			backdrop: 'static',
			keyboard: false,
			size: "lg",
			resolve: {
				group: function () {
					return group;
				}
			}
		});

		modalInstance.result.then(function (user) {
			reload();
		}, function () {});
	};
	$scope.newEntry = function(){
		Restangular.one('/api/group').post().then(function(user) {
			$scope.editEntry(user);
		});
	};

	// trigged on each order change
	$scope.changeOrder = function(field){
		if ($scope.store.selectedOrder.field == field){
			$scope.store.selectedOrder.dir = !$scope.store.selectedOrder.dir;
		}
		else {
			$scope.store.selectedOrder.field = field;
		}
		reload();

		writeToCookie();
	};

	// TODO move to main
	$scope.formateDate = function(unixtime){
		return moment(unixtime*1000).format("DD.MM.YYYY, HH:mm");
	};

	// initial load
	// reload();
	var cookieData = $cookies.getObject('StatsGroupController');
	if (cookieData != undefined){
		$scope.store = cookieData;
	}
	function writeToCookie(){
		$cookies.putObject('StatsGroupController', $scope.store, {});
	}
});

// StatsGroupEditController
// Displays an overlay to edit group object
app.controller('StatsGroupEditController', function (Restangular, $scope, $uibModalInstance, group, gatewaySocket) {
	$scope.group = group;
	if (group.firstName != undefined || group.lastName != undefined){
		$scope.user = {
			firstName: group.firstName,
			lastName: group.lastName,
			verein: group.verein,
			vereinID: group.vereinID,
		};
	}
	if (group.verein != undefined || group.vereinID != undefined){
		$scope.verein = {
			name: group.verein,
			id: group.vereinID,
		};
	}


	gatewaySocket.on("setSession", function(data) {
		if (data.line == $scope.group.line){
			setTimeout(reload, 2500);
		}
	});


	$scope.sessions = group.getList("sessions").then(function(sessions) {
		$scope.sessions = sessions;
	});


	$scope.selected = {};


	function reload(){
		Restangular.all("/api/group/" + $scope.group.id + "/sessions").getList({
			// order: $scope.store.selectedOrder.field,
			// orderDir: $scope.store.selectedOrder.dir == true ? "DESC" : "ASC",
		}).then(function(sessions) {
			$scope.sessions = sessions;
		});
	}
	reload();



	// save and close overlay
	$scope.save = function () {
		if ($scope.user != undefined){
			$scope.group.userID = $scope.user.id;
		}

		$scope.cancel();
		$scope.group.post();
	};

	// delete user and close
	// TODO: ALERT
	$scope.delete = function () {
		$scope.cancel();
		$scope.group.remove();
	};

	// close
	$scope.cancel = function () {
		$uibModalInstance.close($scope.group);
	};


	// TODO move to main
	$scope.formateDate = function(unixtime){
		return moment(unixtime*1000).format("DD.MM.YYYY, HH:mm");
	};




	$scope.zoomlevel = {
		scale: 100,
		offset: { x: -1270, y: -1270 },
	}
	$scope.probeecke = true;
	$scope.scheibe = {
		title: "LG 10m",
		ringe: [
			{ value: 10, width:  0.5,color: "white",  text: false, textColor: "white", zoom: $scope.zoomlevel, hitColor: "red" },
			{ value:  9, width:  5.5, color: "black", text: false, textColor: "white", zoom: $scope.zoomlevel, hitColor: "green" },
			{ value:  8, width: 10.5, color: "black", text: true,  textColor: "white", zoom: $scope.zoomlevel, hitColor: "yellow" },
			{ value:  7, width: 15.5, color: "black", text: true,  textColor: "white", zoom: $scope.zoomlevel, hitColor: "#00bffF" },
			{ value:  6, width: 20.5, color: "black", text: true,  textColor: "white", zoom: $scope.zoomlevel, hitColor: "#00bffF" },
			{ value:  5, width: 25.5, color: "black", text: true,  textColor: "white", zoom: $scope.zoomlevel, hitColor: "#00bffF" },
			{ value:  4, width: 30.5, color: "black", text: true,  textColor: "white", zoom: $scope.zoomlevel, hitColor: "#00bffF" },
			{ value:  3, width: 35.5, color: "white", text: true,  textColor: "black", zoom: $scope.zoomlevel, hitColor: "#00bffF" },
			{ value:  2, width: 40.5, color: "white", text: true,  textColor: "black", zoom: $scope.zoomlevel, hitColor: "#00bffF" },
			{ value:  1, width: 45.5, color: "white", text: true,  textColor: "black", zoom: $scope.zoomlevel, hitColor: "#00bffF" },
		],
		ringeDrawOnly: [],
		rechteckDrawOnly: [],
		defaultHitColor: "#000000",
		defaultZoom: $scope.zoomlevel,
		minZoom: $scope.zoomlevel,
		innenZehner: 200,
		probeEcke: { color: "#0f0", alpha: 0.7 },
		text: { size: 1.0, width: 0.3, up: 1.8, down: -0.8, left: 0.95, right: -1.7 },
		kugelDurchmesser: 4.5,
	}



	// $scope.getVereine = function(serachString) {
	// 	return Restangular.one('/api/group').get({
	// 		search: serachString,
	// 		limit: 1000,
	// 	}).then(function(vereine) {
	// 		return vereine;
	// 	});
	// };
});
