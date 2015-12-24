(function (angular) {
  "use strict";

  var app = angular.module('myApp.appointment', ['ngRoute', 'firebase.utils', 'firebase','ui.bootstrap.datetimepicker']);

  app.controller('AppointmentCtrl', ['$scope','fbutil','$firebaseArray','$location','Profile',function($scope, fbutil,$firebaseArray,$location, Profile) {

    $scope.user=Profile.get(); 
    $scope.array=[];

    $scope.list = [
    {
      "id": "Maths",
      "value": "Maths",
    }, 
    {
      "id": "English",
      "value": "English",
    }, 
    {
      "id": "Physics",
      "value": "Physics"
    }, 
    {
      "id": "Computer",
      "value": "Computer"
    }
    ]; 


    $scope.addQuickAppointment = function(newAppointment) {
      newAppointment.isRegistered=false;
      var ref = fbutil.ref('appointments','quick');
      var list = $firebaseArray(ref);
      list.$add(newAppointment).then(function()
      {
        $location.path('/appointments');
      });
    }

    $scope.addAppointment = function(newAppointment) {

      if(!newAppointment) {
        return;
      } 
      newAppointment.timestamp=Firebase.ServerValue.TIMESTAMP;
      newAppointment.subjects=angular.copy($scope.array);
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
          list.$add(newAppointment).then(function()
          {
            $location.path('/appointments');
          });

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

app.directive("checkboxGroup", function() {
  return {
    restrict: "A",
    link: function(scope, elem, attrs) {
                // Determine initial checked boxes
                if (scope.array.indexOf(scope.item.id) !== -1) {
                  elem[0].checked = true;
                }

                // Update array on click
                elem.bind('click', function() {
                  var index = scope.array.indexOf(scope.item.id);
                    // Add if checked
                    if (elem[0].checked) {
                      if (index === -1) scope.array.push(scope.item.id);
                    }
                    // Remove if unchecked
                    else {
                      if (index !== -1) scope.array.splice(index, 1);
                    }
                    // Sort and update DOM display
                    scope.$apply(scope.array.sort(function(a, b) {
                      return a - b
                    }));
                  });
              }
            }
          });

})(angular);