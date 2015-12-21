(function (angular) {
  "use strict";

  var app = angular.module('myApp.appointment', ['ngRoute', 'firebase.utils', 'firebase','ui.bootstrap.datetimepicker']);

  app.controller('AppointmentCtrl', ['$scope','fbutil','$firebaseArray','Profile',function($scope, fbutil,$firebaseArray,Profile) {

    $scope.user=Profile.get();  


    $scope.addQuickAppointment = function(newAppointment) {
      newAppointment.isRegistered=false;
      var ref = fbutil.ref('appointments','quick');
      var list = $firebaseArray(ref);
      list.$add(newAppointment);
    }

    $scope.addAppointment = function(newAppointment) {

      if(!newAppointment) {
        return;
      } 
      newAppointment.timestamp=Firebase.ServerValue.TIMESTAMP;

      if(newAppointment.date)
      {
        newAppointment.date=moment(newAppointment.date).valueOf();  
      }

      if(typeof $scope.user.$id != "undefined") {
        $scope.user.$loaded().then(function(){

          newAppointment.isRegistered=true;
          newAppointment.email=$scope.user.email;
          newAppointment.name=$scope.user.name;

          var ref = fbutil.ref('appointments',$scope.user.$id);
          var list = $firebaseArray(ref);
          list.$add(newAppointment);

        });
      } else {
        $scope.addQuickAppointment(newAppointment);
      }
    };
  }]);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/appointment', {
    templateUrl: 'appointment/appointment.html',
    controller: 'AppointmentCtrl',
    authData: ['Auth', function (Auth) {
      return Auth.$waitForAuth();
    }]
  });
}]);

})(angular);