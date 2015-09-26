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
		},
		uploadPhotos : function(photos, progress) {
			// resolveLocalFileSystemURL
			(function prepareUpload() {
				console.log(photos[progress.currentIndex++]);
				progress.name = progress.currentIndex;
				if (photos.length > progress.currentIndex){
					prepareUpload();
				}else{
					console.log(progress.currentIndex);
				}
			})();
		},
		uploadPhoto : function(file) {

		}
	};
});