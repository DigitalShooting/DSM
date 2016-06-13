var app = angular.module("dsm.stats.group", [
	"dsm.services.sockets",
	"restangular",
	"ui.bootstrap", "ui.select",
	"ngCookies",
]);

// StatsGroupController
// Lists session groups and perfor search and order
app.controller("StatsGroupController", function($scope, gatewaySocket, Restangular, $uibModal, $cookies) {
	$scope.store = {
		itemsPerPage: 20, // items per page
		selectedOrder: { // Ordering Infos
			field: "unixtime",
			dir: true,
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
		Restangular.one('/sessions/info').get().then(function(info) {
			$scope.totalItems = info;
		});

		Restangular.all('/sessions').getList({
			limit: $scope.itemsPerPage,
			page: $scope.currentPage-1,
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
		Restangular.one('/group').post().then(function(user) {
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
	if (cookieData !== undefined){
		$scope.store = cookieData;
	}
	function writeToCookie(){
		$cookies.putObject('StatsGroupController', $scope.store, {});
	}
});

// StatsGroupEditController
// Displays an overlay to edit group object
app.controller('StatsGroupEditController', function (Restangular, $scope, $uibModalInstance, group, gatewaySocket) {
	$scope.sessionGroup = group;

	$scope.selected = {};



	// close
	$scope.close = function () {
		$uibModalInstance.close($scope.group);
	};


	// TODO move to main
	$scope.formateDate = function(unixtime){
		return moment(unixtime*1000).format("DD.MM.YYYY, HH:mm");
	};



	$scope.actions = {
		sendSessions: function(){
			gatewaySocket.api.loadData($scope.selected.line.id, $scope.sessionGroup);
			console.log($scope.sessionGroup);
			$scope.selected.line = undefined;
		},
	};




	// ------------ Lines -------------
	$scope.lines = [];
	gatewaySocket.emit("getLines", {});

	// listen to DSC-Gateway updates
	var updateLines = function(data){
		var lines = [];
		for (var key in data.lines){
			if (data.lines[key].online) {
				lines.push(data.lines[key]);
			}
		}
		$scope.lines = lines;
	};
	gatewaySocket.on("disconnect", updateLines);
	gatewaySocket.on("onlineLines", updateLines);


});
