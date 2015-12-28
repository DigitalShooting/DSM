var app = angular.module("dsm.rwks.manschaften", [
	"restangular",
	"ui.bootstrap",
	"ngCookies",
]);

// ManschaftenController
// Lists manschaften and perfor search and order
app.controller("ManschaftenController", function($scope, Restangular, $uibModal, $cookies, $log) {
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

	// Reload total item count and manschaften
	function reload(){
		Restangular.one('/api/manschaft/info').get({
			search: $scope.store.search,
		}).then(function(info) {
			$scope.totalItems = info.count;
		});
		Restangular.all('/api/manschaft').getList({
			search: $scope.store.search,
			limit: $scope.store.itemsPerPage,
			page: $scope.currentPage-1,
			order: $scope.store.selectedOrder.field,
			orderDir: $scope.store.selectedOrder.dir == true ? "DESC" : "ASC",
		}).then(function(manschaften) {
			$scope.manschaften = manschaften;
		});
	}

	// open edit for manschaft
	$scope.editEntry = function(manschaft){
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'modalEditingOverlay.html',
			controller: 'ManschaftEditController',
			size: "lg",
			resolve: {
				manschaft: function () {
					return manschaft;
				}
			}
		});

		modalInstance.result.then(function (manschaft) {
			reload()
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
	}
	$scope.newEntry = function(){
		Restangular.one('/api/manschaft').post().then(function(manschaft) {
			$scope.editEntry(manschaft);
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
	// reload();
	var cookieData = $cookies.getObject('manschaft_vars');
	if (cookieData != undefined){
		$scope.store = cookieData;
	}
	function writeToCookie(){
		$cookies.putObject('manschaft_vars', $scope.store, {});
	}
});

// ManschaftEditController
// Displays an overlay to edit manschaft object
app.controller('ManschaftEditController', function (Restangular, $scope, $uibModalInstance, manschaft) {
	$scope.manschaft = manschaft;

	$scope.saison = {
		id: "",
		name: "",
	}
	if (manschaft.saisonID != 0){
		$scope.saison = {
			id: manschaft.saisonID,
			name: manschaft.saison,
		}
	}

	$scope.verein = {
		id: "",
		name: "",
	}
	if (manschaft.vereinID != 0){
		$scope.verein = {
			id: manschaft.vereinID,
			name: manschaft.verein,
		}
	}


	// save and close overlay
	$scope.save = function () {
		$scope.manschaft.saisonID = $scope.saison.id;
		$scope.manschaft.saison = $scope.saison.name;

		$scope.manschaft.vereinID = $scope.verein.id;
		$scope.manschaft.verein = $scope.verein.name;

		$scope.cancel();
		$scope.manschaft.post();
	};

	// delete manschaft and close
	// TODO: ALERT
	$scope.delete = function () {
		$scope.cancel();
		$scope.manschaft.remove();
	};

	// close
	$scope.cancel = function () {
		$uibModalInstance.close($scope.manschaft);
	};



	$scope.getVereine = function(serachString) {
		return Restangular.one('/api/verein').get({
			search: serachString,
			limit: 1000,
		}).then(function(vereine) {
			return vereine;
		});
	};


	$scope.getSaison = function(serachString) {
		return Restangular.one('/api/saison').get({
			search: serachString,
			limit: 1000,
		}).then(function(saisons) {
			return saisons;
		});
	};

});
