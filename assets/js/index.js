//Define an angular module for our app
var app = angular.module('dsm', [
	"ngRoute",
	"dsm.stammdaten.user", "dsm.stammdaten.verein",
	"dsm.rwks.saisons", "dsm.rwks.manschaften", "dsm.rwks.rwks",
	"dsm.lines",
]);

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.

		// lines routes
		when('/lines/', {
			templateUrl: '/lines/',
			controller: 'LinesController',
		}).

		// stammdaten routes
		when('/stammdaten/', {
			redirectTo: '/stammdaten/user/'
		}).
		when('/stammdaten/user/', {
			templateUrl: '/stammdaten/user/',
			controller: 'UserController',
		}).
		when('/stammdaten/vereine/', {
			templateUrl: '/stammdaten/vereine/',
			controller: 'VereinController',
		}).


		// stammdaten routes
		when('/rwks/', {
			redirectTo: '/rwks/rwks/'
		}).
		when('/rwks/saisons/', {
			templateUrl: '/rwks/saisons/',
			controller: 'SaisonController',
		}).
		when('/rwks/manschaften/', {
			templateUrl: '/rwks/manschaften/',
			controller: 'ManschaftenController',
		}).
		when('/rwks/rwks/', {
			templateUrl: '/rwks/rwks/',
			controller: 'RWKsController',
		}).


		// exit route
		when('/exit/', {
			templateUrl: '/exit/',
		}).


		// start page
		otherwise({
			redirectTo: '/stammdaten/',
		});
}]);
app.run(['$rootScope','$location', '$routeParams', function($rootScope, $location, $routeParams) {
	$rootScope.$on('$routeChangeSuccess', function(e, current, pre) {
		$rootScope.path = $location.path();
	});
}]);
