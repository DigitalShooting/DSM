var app = angular.module("dsm.rwks.saisons", [
	"restangular",
	"ui.bootstrap",
	"ngCookies",
]);

// SaisonController
// Lists saisons and perfor search and order
app.controller("SaisonController", function($scope, Restangular, $uibModal, $cookies, $log) {
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

	// Reload total item count and saisons
	function reload(){
		Restangular.one('/api/saison/info').get({
			search: $scope.store.search,
		}).then(function(info) {
			$scope.totalItems = info.count;
		});
		Restangular.all('/api/saison').getList({
			search: $scope.store.search,
			limit: $scope.store.itemsPerPage,
			page: $scope.currentPage-1,
			order: $scope.store.selectedOrder.field,
			orderDir: $scope.store.selectedOrder.dir == true ? "DESC" : "ASC",
		}).then(function(saisons) {
			$scope.saisons = saisons;
		});
	}

	// open edit for saison
	$scope.editEntry = function(saison){
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'modalEditingOverlay.html',
			controller: 'SaisonEditController',
			size: "lg",
			resolve: {
				saison: function () {
					return saison;
				}
			}
		});

		modalInstance.result.then(function (saison) {
			reload()
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
	}
	$scope.newEntry = function(){
		Restangular.one('/api/saison').post().then(function(saison) {
			$scope.editEntry(saison);
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
	var cookieData = $cookies.getObject('saison_vars');
	if (cookieData != undefined){
		$scope.store = cookieData;
	}
	function writeToCookie(){
		$cookies.putObject('saison_vars', $scope.store, {});
	}
});

// SaisonEditController
// Displays an overlay to edit saison object
app.controller('SaisonEditController', function (Restangular, $scope, $uibModalInstance, saison) {
	$scope.saison = saison;


	// save and close overlay
	$scope.save = function () {
		$scope.cancel();
		$scope.saison.post();
	};

	// delete saison and close
	// TODO: ALERT
	$scope.delete = function () {
		$scope.cancel();
		$scope.saison.remove();
	};

	// close
	$scope.cancel = function () {
		$uibModalInstance.close($scope.saison);
	};
});
