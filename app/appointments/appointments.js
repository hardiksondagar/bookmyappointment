(function (angular) {
  "use strict";

  var app = angular.module('myApp.appointments',  ['firebase', 'firebase.utils', 'firebase.auth', 'ngRoute']);

  app.controller('AppointmentsCtrl',  ['$scope', 'appointmentList','fbutil','Profile','$filter',function($scope, appointmentList, $fbutil,Profile,$filter) {

    var orderBy = $filter('orderBy');

    $scope.user=Profile.get();
    $scope.isAdmin=false;



    $scope.user.$loaded().then(function () {

      if($scope.user.role==="admin"){
        $scope.isAdmin=true;
        $scope.appointments = appointmentList.all();
      } else {
        $scope.appointments = appointmentList.get($scope.user.$id);
      }
    });


    $scope.order = function(predicate) {
      $scope.predicate = predicate;
      $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
      $scope.appointments = orderBy($scope.appointments, predicate, $scope.reverse);
    };
    $scope.order('timestamp', true);

    $scope.remove=function(appointment)
    {

      appointmentList.delete(appointment.uid,appointment.id);
      $scope.appointments = appointmentList.all();
    }

  }]);

  app.service('appointmentList', ['fbutil', '$firebaseArray','$firebaseObject', function(fbutil, $firebaseArray, $firebaseObject) {

    return {
      // Get student's all the appointments ( for student )
      get: function (uid) {
        var ref=fbutil.ref('appointments', uid);
        return $firebaseArray(ref);
      },
      // Get all the students appointments ( for admin )
      all:function () {
        var ref=fbutil.ref('appointments');
        var rawData=$firebaseArray(ref);
        var appointments=[];
        rawData.$loaded().then(function () {
          angular.forEach(rawData, function(value, key) {
            angular.forEach(value, function(subvalue, subkey) {
              if(typeof subvalue=="object" && subvalue)
              {
                subvalue.uid=value.$id;
                subvalue.id=subkey;
                appointments.push(subvalue);
              }
            });
          });
        });
        return appointments;
      },
      delete:function(uid,id)
      {
        var ref=fbutil.ref('appointments',uid);
        return $firebaseObject(ref).$remove(id);
      }
    };
  }]);  

app.config(['$routeProvider', function($routeProvider) {
 $routeProvider.whenAuthenticated('/appointments', {
  templateUrl: 'appointments/appointments.html',
  controller: 'AppointmentsCtrl',
  resolve: {
    authData: ['Auth', function (Auth) {
      return Auth.$requireAuth();
    }]
  }
});
}]);

})(angular);