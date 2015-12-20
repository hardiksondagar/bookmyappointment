(function (angular) {
  "use strict";

  var app = angular.module('myApp.appointment', ['ngRoute', 'firebase.utils', 'firebase']);

  app.controller('AppointmentCtrl', ['$rootScope','$scope','fbutil','$firebaseArray',function($rootScope,$scope, fbutil,$firebaseArray) {
    $scope.addAppointment = function(newAppointment) {
      if($rootScope.loggedIn){
        newAppointment.isRegistered=true;
        newAppointment.email=$rootScope.user.password.email;
        newAppointment.uid=$rootScope.user.auth.uid;
        newAppointment.$priority=$rootScope.user.auth.uid;
      }else
      {
        newAppointment.isRegistered=false;
      }
      newAppointment.timestamp=Firebase.ServerValue.TIMESTAMP;
      if(newAppointment) {
        var key='quick';
        if(newAppointment.isRegistered)
        {
          key=$rootScope.user.auth.uid;
        }
        var ref = fbutil.ref('appointments/'+key);
        var list = $firebaseArray(ref);
        list.$add(newAppointment);
      }
    };
  }]);

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/appointment', {
      templateUrl: 'appointment/appointment.html',
      controller: 'AppointmentCtrl'
    });
  }]);

})(angular);