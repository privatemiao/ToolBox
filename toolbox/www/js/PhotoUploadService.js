angular.module('generic.services', []).factory('PhotoUploadService', function($q) {
	return {
		gatherPhotos : function(photos) {
			var defer = $q.defer();
			photos.length = 0;
			CameraRoll.getPhotos(function(photo) {
				if (photo) {
					photos.push(photo);
				} else {
					defer.resolve();
				}
			});
			return defer.promise;
		}
	};
});