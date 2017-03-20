//Define an angular module for our app
var app = angular.module('dsm', [
	"ngRoute", "angular-intro",
	"dsm.lines",
	"dsm.stammdaten.user", "dsm.stammdaten.verein", "dsm.stammdaten.manschaften",
	"dsm.stats.group",
	"dsm.services.typeahead.user",
]);

var scaleFactor = 4;

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.

		// lines routes
		when('/lines', {
			templateUrl: '/lines',
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
		when('/stammdaten/manschaften/', {
			templateUrl: '/stammdaten/manschaften/',
			controller: 'ManschaftenController',
		}).


		// stats routes
		when('/stats/', {
			redirectTo: '/stats/group/'
		}).
		when('/stats/group/', {
			templateUrl: '/stats/group/',
			controller: 'StatsGroupController',
		}).


		// exit route
		when('/exit/', {
			templateUrl: '/exit/',
		}).


		// start page
		otherwise({
			redirectTo: '/lines',
		});
}]);
app.run(['$rootScope','$location', 'Restangular', function($rootScope, $location, Restangular) {
	Restangular.setBaseUrl('/api/');

	$rootScope.$on('$routeChangeSuccess', function() {
		$rootScope.path = $location.path();
	});


	$rootScope.IntroOptions = {
		steps:[
			{
				element: document.querySelector('#step1'),
				intro: "This is the first tooltip."
			},
			{
				element: document.querySelectorAll('#step2')[0],
				intro: "<strong>You</strong> can also <em>include</em> HTML",
				position: 'right'
			},
			{
				element: '#step3',
				intro: 'More features, more fun.',
				position: 'left'
			},
			{
				element: '#step4',
				intro: "Another step.",
				position: 'bottom'
			},
			{
				element: '#step5',
				intro: 'Get it, use it.'
			}
		],
		showStepNumbers: false,
		exitOnOverlayClick: true,
		exitOnEsc: true,
		nextLabel: "<strong>Weiter</strong>",
		prevLabel: "Zurück",
		skipLabel: "Abbrechen",
		doneLabel: "Los geht's",
	};
}]);
