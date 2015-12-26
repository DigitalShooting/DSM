var app = angular.module("dsm", [
	"restangular",
	"ui.bootstrap",
	"ngCookies",
]);

// RWKsController
// Lists rwks and perfor search and order
app.controller("RWKsController", function($scope, Restangular, $uibModal, $cookies, $log) {
	$scope.store = {
		itemsPerPage: 20, // items per page
		selectedOrder: { // Ordering Infos
			field: "name",
			dir: false,
		},
		search: "", // Search Property
	}

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

	// Reload total item count and rwks
	function reload(){
		Restangular.one('/api/rwk/info').get({
			search: $scope.store.search,
		}).then(function(info) {
			$scope.totalItems = info.count;
		});
		Restangular.all('/api/rwk').getList({
			search: $scope.store.search,
			limit: $scope.store.itemsPerPage,
			page: $scope.currentPage-1,
			order: $scope.store.selectedOrder.field,
			orderDir: $scope.store.selectedOrder.dir == true ? "DESC" : "ASC",
		}).then(function(rwks) {
			$scope.rwks = rwks;
		});
	}

	// open edit for rwk
	$scope.editEntry = function(rwk){
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'modalEditingOverlay.html',
			controller: 'RWKEditController',
			size: "lg",
			resolve: {
				rwk: function () {
					return rwk;
				}
			}
		});

		modalInstance.result.then(function (rwk) {
			reload()
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
	}
	$scope.newEntry = function(){
		Restangular.one('/api/rwk').post().then(function(rwk) {
			$scope.editEntry(rwk);
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

	// initial load
	reload();
	var cookieData = $cookies.getObject('rwk_vars');
	if (cookieData != undefined){
		$scope.store = cookieData;
	}
	function writeToCookie(){
		$cookies.putObject('rwk_vars', $scope.store, {});
	}
});

// RWKEditController
// Displays an overlay to edit rwk object
app.controller('RWKEditController', function (Restangular, $scope, $uibModalInstance, rwk) {
	$scope.rwk = rwk;

	$scope.heim = {
		id: "",
		name: "",
		verein: "",
		saison: "",
	}
	if (rwk.manschaftHeim != 0){
		$scope.heim = {
			id: rwk.manschaftHeim,
			name: rwk.heim,
			verein: rwk.heimVerein,
			saison: rwk.heimSaison,
		}
	}

	$scope.gast = {
		id: "",
		name: "",
		verein: "",
		saison: "",
	}
	if (rwk.manschaftGast != 0){
		$scope.gast = {
			id: rwk.manschaftGast,
			name: rwk.gast,
			verein: rwk.gastVerein,
			saison: rwk.gastSaison,
		}
	}


	// save and close overlay
	$scope.save = function () {
		console.log($scope.heim, $scope.gast)

		$scope.rwk.manschaftHeim = $scope.heim.id;
		$scope.rwk.heim = $scope.heim.name;

		$scope.rwk.manschaftGast = $scope.gast.id;
		$scope.rwk.gast = $scope.gast.name;

		$scope.cancel();
		$scope.rwk.post();
	};

	// delete rwk and close
	// TODO: ALERT
	$scope.delete = function () {
		$scope.cancel();
		$scope.rwk.remove();
	};

	// close
	$scope.cancel = function () {
		$uibModalInstance.close($scope.rwk);
	};


	$scope.getManschaft = function(serachString) {
		return Restangular.one('/api/manschaft').get({
			search: serachString,
			limit: 1000,
		}).then(function(manschaften) {
			return manschaften;
		});
	};
	$scope.getManschaftTitle = function(manschaft){
		console.log(manschaft)
		if (manschaft.verein != undefined){
			return manschaft.verein + " " + manschaft.name + " ("+manschaft.saison+")";
		}
		return "";

	}
});
