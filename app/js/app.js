var bmaApp = angular.module('bmaApp', ["ui.router"])
bmaApp.config(function($stateProvider,$urlRouterProvider){
	$stateProvider
	.state('index', {
		url: "/home",
		views: {
			"nav": {
				templateUrl: "templates/nav.html"
			},
			"content": {
				templateUrl: "templates/home.html"
			}
		}
	})
	.state('quick', {
		url: "/quick",
		views: {
			"nav": {
				templateUrl: "templates/nav.html"
			},
			"content": {
				templateUrl: "templates/quick.html"
			}
		}
	})
	.state('register', {
		url: "/register",
		views: {
			"nav": {
				templateUrl: "templates/nav.html"
			},
			"content": {
				templateUrl: "templates/register.html"
			}
		}
	})
	.state('login', {
		url: "/login",
		views: {
			"nav": {
				templateUrl: "templates/nav.html"
			},
			"content": {
				templateUrl: "templates/login.html"
			}
		}
	});

	$urlRouterProvider.otherwise('/home');

});