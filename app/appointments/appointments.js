(function (angular) {
  "use strict";

  var app = angular.module('myApp.appointments',  ['firebase', 'firebase.utils', 'firebase.auth', 'ngRoute']);

  app.controller('AppointmentsCtrl',  ['$rootScope','$scope', 'appointmentList','fbutil', function($rootScope,$scope, appointmentList, $fbutil) {
    $scope.appointments = appointmentList;
  }]);

  app.factory('appointmentList', ['fbutil', '$firebaseArray','Auth',function(fbutil, $firebaseArray,Auth) {
    var ref = fbutil.ref('appointments').limitToLast(10);

    var user=Auth.$getAuth();

    console.log(user.uid);
    // console.log(user);
    var ref = fbutil.ref('appointments');//.startAt(user.uid).endAt(user.uid).limitToLast(10);
    return $firebaseArray(ref);
  }]);

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/appointments', {
      templateUrl: 'appointments/appointments.html',
      controller: 'AppointmentsCtrl'
    });
  }]);

})(angular);