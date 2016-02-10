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
		Restangular.all("/api/group/" + $scope.group.id + "/sessions").getList().then(function(sessions) {
			$scope.sessions = sessions;
		});
		Restangular.one("/api/disziplinen/" + $scope.group.disziplin).get().then(function(disziplin) {
			$scope.disziplin = disziplin;
		});
		Restangular.one("/api/lines/" + $scope.group.line).get().then(function(line) {
			$scope.line = line;
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






	// $scope.getVereine = function(serachString) {
	// 	return Restangular.one('/api/group').get({
	// 		search: serachString,
	// 		limit: 1000,
	// 	}).then(function(vereine) {
	// 		return vereine;
	// 	});
	// };
});
