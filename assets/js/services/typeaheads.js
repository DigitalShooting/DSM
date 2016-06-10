angular.module('dsm.services.typeahead.user', [
	"restangular",
	"ui.bootstrap",
])

.directive('userTypeahead', ['$timeout', '$window', 'Restangular', function($timeout, $window, Restangular){
	return {
		template: "\
		<div class='input-group'>\
			<input onClick='this.select();' type='text' ng-model='user' placeholder='Schütze' uib-typeahead='user as getSearchTitle(user) for user in getUsers($viewValue)' typeahead-loading='loadingUser' typeahead-input-formatter='getUserTitle($model)' typeahead-no-results='noResultsUser' typeahead-on-select='selectUser()' class='form-control'/>\
			<span class='input-group-btn'>\
				<button type='button' class='btn btn-default btn noMargin' ng-click='user = \"\";'>\
					<span class='glyphicon glyphicon-remove' aria-hidden='true'/>\
				</button>\
			</span>\
		</div>\
		<i ng-show='loadingUser' class='glyphicon glyphicon-refresh'/>\
		<div ng-show='noResultsUser'>\
			<i class='glyphicon glyphicon-remove'/>\
			Kein Schütze gefunden\
		</div>",
		scope: {
			user: '=',
			verein: '=',
		},
		link: function postlink($scope){
			$scope.selectUser = function(){
				$scope.verein = {
					name: $scope.user.verein,
					id: $scope.user.vereinID,
				};
			};
			$scope.getUsers = function(serachString){
				var query = {
					search: serachString,
					limit: 100,
				};

				if ($scope.verein !== undefined && typeof $scope.verein !== "string"){
					query.equals_vereinID = $scope.verein.id;
				}
				return Restangular.one('/user').get(query).then(function(users) {
					return users;
				});
			};
			$scope.getUserTitle = function(user){
				if (user !== undefined && typeof user !== "string" && user.firstName !== null){
					return user.firstName + " " + user.lastName;
				}
				return "";
			};
			$scope.getSearchTitle = function(user){
				var string = "";
				if (user !== undefined){
					string = user.firstName + " " + user.lastName;
				}
				if ($scope.verein === undefined || typeof $scope.verein === "string"){
					string += " (" + user.verein + ")";
				}
				return string;
			};
		}
	};
}])


.directive('vereinTypeahead', ['$timeout', '$window', 'Restangular', function($timeout, $window, Restangular){
	return {
		template: "\
		<div class='input-group'>\
			<input onClick='this.select();' type='text' ng-model='verein' placeholder='Verein' uib-typeahead='verein as verein.name for verein in getVereine($viewValue)' typeahead-loading='loadingVerein' typeahead-input-formatter='getTitle($model)' typeahead-no-results='noResultsVerein' class='form-control'/>\
			<span class='input-group-btn'>\
				<button type='button' class='btn btn-default btn noMargin' ng-click='verein = \"\";'>\
					<span class='glyphicon glyphicon-remove' aria-hidden='true'/>\
				</button>\
			</span>\
		</div>\
		<i ng-show='loadingVerein' class='glyphicon glyphicon-refresh'/>\
		<div ng-show='noResultsVerein'>\
			<i class='glyphicon glyphicon-remove'/>\
			Kein Verein gefunden\
		</div>",
		scope: {
			user: '=',
			verein: '=',
		},
		link: function postlink($scope){
			$scope.getVereine = function(serachString){
				var query = {
					search: serachString,
					limit: 100,
				};

				return Restangular.one('/verein').get(query).then(function(vereine) {
					return vereine;
				});
			};
			$scope.getTitle = function(verein){
				if (verein !== undefined){
					return verein.name;
				}
				return "";
			};
			$timeout(function(){
				$scope.$watch('verein', function(){
					if ($scope.verein !== undefined && typeof $scope.verein !== "string" && $scope.user !== undefined && $scope.verein.id !== $scope.user.vereinID){
						$scope.user = null;
					}
				});
			});
		}
	};
}])


.directive('manschaftTypeahead', ['$timeout', '$window', 'Restangular', function($timeout, $window, Restangular){
	return {
		template: "\
		<div class='input-group'>\
			<input onClick='this.select();' type='text' ng-model='manschaft' placeholder='Manschaft' uib-typeahead='manschaft as getTitle(manschaft) for manschaft in getManschaft($viewValue)' typeahead-loading='loadingManschaft' typeahead-input-formatter='getTitle($model)' typeahead-no-results='noResultsManschaft' class='form-control'/>\
			<span class='input-group-btn'>\
				<button type='button' class='btn btn-default btn noMargin' ng-click='manschaft = \"\";'>\
					<span class='glyphicon glyphicon-remove' aria-hidden='true'/>\
				</button>\
			</span>\
		</div>\
		<i ng-show='loadingManschaft' class='glyphicon glyphicon-refresh'/>\
		<div ng-show='noResultsManschaft'>\
			<i class='glyphicon glyphicon-remove'/>\
			Keine Manschaft gefunden\
		</div>",
		scope: {
			manschaft: '=',
		},
		link: function postlink($scope){
			$scope.getManschaft = function(serachString) {
				return Restangular.one('/manschaft').get({
					search: serachString,
					limit: 1000,
				}).then(function(manschaften) {
					return manschaften;
				});
			};
			$scope.getTitle = function(manschaft){
				if (manschaft.verein !== undefined){
					return manschaft.verein + " " + manschaft.name + " ("+manschaft.saison+")";
				}
				return "";
			};
		}
	};
}])


.directive('saisonTypeahead', ['$timeout', '$window', 'Restangular', function($timeout, $window, Restangular){
	return {
		template: "\
		<div class='input-group'>\
			<input onClick='this.select();' type='text' ng-model='saison' placeholder='Saison' uib-typeahead='saison as saison.name for saison in getSaison($viewValue)' typeahead-loading='loadingSaison' typeahead-no-results='noResultsSaison' class='form-control'/>\
			<span class='input-group-btn'>\
				<button type='button' class='btn btn-default btn noMargin' ng-click='saison = \"\";'>\
					<span class='glyphicon glyphicon-remove' aria-hidden='true'/>\
				</button>\
			</span>\
		</div>\
		<i ng-show='loadingSaison' class='glyphicon glyphicon-refresh'/>\
		<div ng-show='noResultsSaison'>\
			<i class='glyphicon glyphicon-remove'/>\
			Keine Saison gefunden\
		</div>",
		scope: {
			saison: '=',
		},
		link: function postlink($scope, element, attrs){
			$scope.getSaison = function(serachString) {
				return Restangular.one('/saison').get({
					search: serachString,
					limit: 1000,
				}).then(function(saisons) {
					return saisons;
				});
			};
		}
	};
}])
