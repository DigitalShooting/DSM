Date.prototype.yyyymmdd = function() {
	var yyyy = this.getFullYear().toString();
	var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
	var dd  = this.getDate().toString();
	return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]); // padding
};



var app = angular.module("dsm.rwks.activeRWKs", [
	"restangular",
	"ui.bootstrap",
	"ngCookies",
]);



// RWKsController
// Lists rwks and perfor search and order
app.controller("ActiveRWKsController", function($scope, Restangular, $uibModal, $cookies, $log) {
	$scope.store = {
		itemsPerPage: 20, // items per page
		selectedOrder: { // Ordering Infos
			field: "date",
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
			done: 0,
		}).then(function(info) {
			$scope.totalItems = info.count;
		});
		Restangular.all('/api/rwk').getList({
			search: $scope.store.search,
			limit: $scope.store.itemsPerPage,
			page: $scope.currentPage-1,
			order: $scope.store.selectedOrder.field,
			orderDir: $scope.store.selectedOrder.dir == true ? "DESC" : "ASC",
			done: 0,
		}).then(function(rwks) {
			$scope.rwks = rwks;
		});
	}

	// open edit for rwk
	$scope.editEntry = function(rwk){
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'modalEditingOverlay.html',
			controller: 'ActiveRWKEditController',
			backdrop: 'static',
			keyboard: false,
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
	// reload();
	var cookieData = $cookies.getObject('ActiveRwk_vars');
	if (cookieData != undefined){
		$scope.store = cookieData;
	}
	function writeToCookie(){
		$cookies.putObject('ActiveRwk_vars', $scope.store, {});
	}
});

// ActiveRWKEditController
// Displays an overlay to edit rwk object
app.controller('ActiveRWKEditController', function (Restangular, $scope, $cookies, $uibModalInstance, rwk) {
	$scope.store = {
		selectedOrder: { // Ordering Infos
			field: "lastName",
			dir: false,
		},
	}


	$scope.rwk = rwk;
	$scope.date = new Date()
	if (rwk.date != "0000-00-00"){
		$scope.date = new Date(rwk.date);
	}

	$scope.$watch('date', function() {
		$scope.rwk.date = $scope.date.yyyymmdd();
	});

	$scope.$watch('heim', function() {
		loadHeimMembers();
	});
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

	$scope.$watch('gast', function() {
		loadGastMembers();
	});
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
		$scope.rwk.manschaftHeim = $scope.heim.id;
		$scope.rwk.heim = $scope.heim.name;

		$scope.rwk.manschaftGast = $scope.gast.id;
		$scope.rwk.gast = $scope.gast.name;

		$scope.cancel();
		$scope.rwk.post();
	};

	// delete rwk and close
	// TODO: ALERT
	$scope.end = function () {
		$scope.rwk.done = "1";
		$scope.save();
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
		if (manschaft.verein != undefined){
			return manschaft.verein + " " + manschaft.name + " ("+manschaft.saison+")";
		}
		return "";
	}





	function loadHeimMembers(){
		if ($scope.heim.id != undefined && $scope.heim.id != ""){
			Restangular.all("/api/memberIn/rwk/" + $scope.rwk.id).getList({
				equals_manschaftID: $scope.heim.id,
				order: $scope.store.selectedOrder.field,
				orderDir: $scope.store.selectedOrder.dir == true ? "DESC" : "ASC",
			}).then(function(members) {
				console.log(members, $scope.rwk.id)
				$scope.heimMembers = members;
			});
		}
		else {
			$scope.heimMembers = [];
		}
	}
	function loadGastMembers(){
		if ($scope.gast.id != undefined && $scope.gast.id != ""){
			Restangular.all("/api/memberIn/rwk/" + $scope.rwk.id).getList({
				equals_manschaftID: $scope.gast.id,
				order: $scope.store.selectedOrder.field,
				orderDir: $scope.store.selectedOrder.dir == true ? "DESC" : "ASC",
			}).then(function(members) {
				console.log(members, $scope.rwk.id)
				$scope.gastMembers = members;
			});
		}
		else {
			$scope.gastMembers = [];
		}
	}
	loadHeimMembers();
	loadGastMembers();




	// trigged on each order change
	$scope.changeOrder = function(field){
		if ($scope.store.selectedOrder.field == field){
			$scope.store.selectedOrder.dir = !$scope.store.selectedOrder.dir;
		}
		else {
			$scope.store.selectedOrder.field = field;
		}
		loadUsers();

		writeToCookie();
	};



	var cookieData = $cookies.getObject('ActiveRwk_member_vars');
	if (cookieData != undefined){
		$scope.store = cookieData;
	}
	function writeToCookie(){
		$cookies.putObject('ActiveRwk_member_vars', $scope.store, {});
	}



});
