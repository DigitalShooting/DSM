//Define an angular module for our app
var app = angular.module('dsm', [
	"ngRoute", "angular-intro",
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



	$rootScope.CompletedEvent = function (scope) {
		console.log("Completed Event called");
	};

	$rootScope.ExitEvent = function (scope) {
		console.log("Exit Event called");
	};

	$rootScope.ChangeEvent = function (targetElement, scope) {
		console.log("Change Event called");
		console.log(targetElement);  //The target element
		console.log(this);  //The IntroJS object
	};

	$rootScope.BeforeChangeEvent = function (targetElement, scope) {
		console.log("Before Change Event called");
		console.log(targetElement);
	};

	$rootScope.AfterChangeEvent = function (targetElement, scope) {
		console.log("After Change Event called");
		console.log(targetElement);
	};

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
