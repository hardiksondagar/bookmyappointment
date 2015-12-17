(function (angular) {
  "use strict";

  var app = angular.module('myApp.appointment', ['ngRoute', 'firebase.utils', 'firebase']);

  app.controller('AppointmentCtrl', ['$rootScope','$scope', 'appointmentList',function($rootScope,$scope, appointmentList) {
    $scope.appointments = appointmentList;
    $scope.addAppointment = function(newAppointment) {

      if($rootScope.loggedIn)
      {
        console.log($rootScope.user);
        newAppointment.isRegistered=true;
        newAppointment.email=$rootScope.user.password.email;
        newAppointment.uid=$rootScope.user.uid;
        newAppointment.$priority=$rootScope.user.uid;
      }
      else
      {
        newAppointment.isRegistered=false;
      }

      if( newAppointment ) {
        console.log(newAppointment);
        $scope.appointments.$add(newAppointment);
      }
    };
  }]);

  app.factory('appointmentList', ['fbutil', '$firebaseArray', function(fbutil, $firebaseArray) {
    var ref = fbutil.ref('appointments').limitToLast(10);
    return $firebaseArray(ref);
  }]);

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/appointment', {
      templateUrl: 'appointment/appointment.html',
      controller: 'AppointmentCtrl'
    });
  }]);

})(angular);