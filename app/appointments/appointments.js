(function (angular) {
  "use strict";

  var app = angular.module('myApp.appointments',  ['firebase', 'firebase.utils', 'firebase.auth', 'ngRoute']);

  app.controller('AppointmentsCtrl',  ['$scope', 'appointmentList','fbutil','Profile',function($scope, appointmentList, $fbutil,Profile) {
    $scope.user=Profile.get();
    $scope.user.$loaded().then(function () {
      if($scope.user.role==="admin"){
        $scope.appointments=[];
        $scope.rawData = appointmentList.all();
        $scope.rawData.$loaded().then(function () {
          angular.forEach($scope.rawData, function(value, key) {
            angular.forEach(value, function(subvalue, subkey) {
              if(typeof subvalue=="object" && subvalue)
              {
                console.log(key);
                $scope.appointments.push(subvalue);
              }
            });
          });
        });
        
      } else {
        $scope.myappointments = appointmentList.get($scope.user.$id);

      }
    });
  }]);

  app.service('appointmentList', ['fbutil', '$firebaseArray', function(fbutil, $firebaseArray) {

    return {
      get: function (uid) {
        var ref=fbutil.ref('appointments', uid);
        return $firebaseArray(ref);
      },
      all:function () {
        var ref=fbutil.ref('appointments');
        return $firebaseArray(ref);
      }

    };
  }]);  

  app.config(['$routeProvider', function($routeProvider) {
   $routeProvider.whenAuthenticated('/appointments', {
    templateUrl: 'appointments/appointments.html',
    controller: 'AppointmentsCtrl',
    resolve: {
        // forces the page to wait for this promise to resolve before controller is loaded
        // the controller can then inject `user` as a dependency. This could also be done
        // in the controller, but this makes things cleaner (controller doesn't need to worry
        // about auth status or timing of accessing data or displaying elements)
   user: ['Auth', function (Auth) {
    return Auth.$waitForAuth();
  }]
}
});
 }]);

})(angular);