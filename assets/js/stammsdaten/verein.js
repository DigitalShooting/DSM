var app = angular.module("dsm.stammdaten.verein", [
	"restangular",
	"ui.bootstrap",
	"ngCookies",
]);

// VereinController
// Lists vereine and perfor search and order
app.controller("VereinController", function($scope, Restangular, $uibModal, $cookies, $log) {
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

	// Reload total item count and vereine
	function reload(){
		Restangular.one('/api/verein/info').get({
			search: $scope.store.search,
		}).then(function(info) {
			$scope.totalItems = info.count;
		});
		Restangular.all('/api/verein').getList({
			search: $scope.store.search,
			limit: $scope.store.itemsPerPage,
			page: $scope.currentPage-1,
			order: $scope.store.selectedOrder.field,
			orderDir: $scope.store.selectedOrder.dir == true ? "DESC" : "ASC",
		}).then(function(vereine) {
			$scope.vereine = vereine;
		});
	}

	// open edit for verein
	$scope.editEntry = function(verein){
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'modalEditingOverlay.html',
			controller: 'VereinEditController',
			size: "lg",
			resolve: {
				verein: function () {
					return verein;
				}
			}
		});

		modalInstance.result.then(function (verein) {
			reload()
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
	}
	$scope.newEntry = function(){
		Restangular.one('/api/verein').post().then(function(verein) {
			$scope.editEntry(verein);
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
	var cookieData = $cookies.getObject('verein_vars');
	if (cookieData != undefined){
		$scope.store = cookieData;
	}
	function writeToCookie(){
		$cookies.putObject('verein_vars', $scope.store, {});
	}
});

// VereinEditController
// Displays an overlay to edit verein object
app.controller('VereinEditController', function (Restangular, $scope, $uibModalInstance, verein) {
	$scope.verein = verein;


	// save and close overlay
	$scope.save = function () {
		$scope.cancel();
		$scope.verein.post();
	};

	// delete verein and close
	// TODO: ALERT
	$scope.delete = function () {
		$scope.cancel();
		$scope.verein.remove();
	};

	// close
	$scope.cancel = function () {
		$uibModalInstance.close($scope.verein);
	};
});
