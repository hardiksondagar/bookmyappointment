angular.module('firebase.auth', ['firebase', 'firebase.utils'])
.factory('Auth', ['$firebaseAuth', 'fbutil', function($firebaseAuth, fbutil) {
	return $firebaseAuth(fbutil.ref());
}])


.service('Profile', ['$firebaseObject', 'fbutil', 'Auth', function($firebaseObject, fbutil, Auth) {
	
	
	return {
		get: function () {
			var auth=Auth.$getAuth();
			if(auth)
			{
				var ref=fbutil.ref('users', auth.uid);
				return $firebaseObject(ref);
			}
			return [];
			
		}
	};
}]);  
