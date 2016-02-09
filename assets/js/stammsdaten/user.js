var app = angular.module("dsm.stammdaten.user", [
	"restangular",
	"ui.bootstrap",
	"ngCookies",
]);

// UserController
// Lists users and perfor search and order
app.controller("UserController", function($scope, Restangular, $uibModal, $cookies, $log) {
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
	$scope.$watcåh('store.itemsPerPage', function() {
		reload(); // reload on change
		writeToCookie();
	});

	// items to display (on all pages)
	$scope.totalItems = 0;
	// currend selected page
	$scope.currentPage = 1;
	// pagination pages listed
	$scope.paginationMaxSize = 10;

	// Reload total item count and users
	function reload(){
		Restangular.one('/api/user/info').get({
			search: $scope.store.search,
		}).then(function(info) {
			$scope.totalItems = info.count;
		});
		Restangular.all('/api/user').getList({
			search: $scope.store.search,
			limit: $scope.store.itemsPerPage,
			page: $scope.currentPage-1,
			order: $scope.store.selectedOrder.field,
			orderDir: $scope.store.selectedOrder.dir == true ? "DESC" : "ASC",
		}).then(function(users) {
			$scope.users = users;
		});
	}

	// open edit for user
	$scope.editEntry = function(user){
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'modalEditingOverlay.html',
			controller: 'UserEditController',
			backdrop: 'static',
			keyboard: false,
			size: "lg",
			resolve: {
				user: function () {
					return user;
				}
			}
		});

		modalInstance.result.then(function (user) {
			reload();
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
	};
	$scope.newEntry = function(){
		Restangular.one('/api/user').post().then(function(user) {
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

	// initial load
	// reload();
	var cookieData = $cookies.getObject('UserController');
	if (cookieData != undefined){
		$scope.store = cookieData;
	}
	function writeToCookie(){
		$cookies.putObject('UserController', $scope.store, {});
	}
});

// UserEditController
// Displays an overlay to edit user object
app.controller('UserEditController', function (Restangular, $scope, $uibModalInstance, user) {
	$scope.user = user;
	$scope.verein = {
		id: "",
		name: "",
	};
	if (user.vereinID != 0){
		$scope.verein = {
			id: user.vereinID,
			name: user.verein,
		};
	}


	// save and close overlay
	$scope.save = function () {
		$scope.user.vereinID = $scope.verein.id;
		$scope.user.verein = $scope.verein.name;

		$scope.cancel();
		$scope.user.post();
	};

	// delete user and close
	// TODO: ALERT
	$scope.delete = function () {
		$scope.cancel();
		$scope.user.remove();
	};

	// close
	$scope.cancel = function () {
		$uibModalInstance.close($scope.user);
	};
});
