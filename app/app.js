'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', [
	'myApp.config',
	'myApp.security',
	'myApp.home',
	'myApp.account',
	'myApp.login',
	'myApp.appointment',
	'myApp.appointments'
	])

.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.otherwise({
		redirectTo: '/home'
	});
}])

.run(['$rootScope', 'Auth', function($rootScope, Auth) {
  // track status of authentication
  Auth.$onAuth(function(user) {
  	$rootScope.loggedIn = !!user;
  	$rootScope.user=user;
  });
}]);