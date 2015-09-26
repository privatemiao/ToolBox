angular.module('generic.services', []).factory('PhotoUploadService', function($q, $timeout) {
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
			var reference = this;
			(function prepareUpload() {
				resolveLocalFileSystemURL(photos[progress.currentIndex++], function(entry) {
					entry.file(function(file) {
						var f = {
							name : file.name,
							lastModified : file.lastModified,
							localURL : file.localURL,
							size : file.size,
							type : file.type,
							uuid : device.uuid
						}
						progress.type = (function() {
							if (f.type.startsWith('image/')) {
								return 'image';
							} else {
								return 'video';
							}
						})();
						progress.name = f.name;
						reference.uploadPhoto(f, progress).then(function() {
							if (photos.length > progress.currentIndex) {
								prepareUpload();
							}
						}, function(error) {
							console.log('ERROR->', error)
						});
					});
				});
			})();
		},
		uploadPhoto : function(file, progress) {
			console.log('UploadFile->', file);
			var defer = $q.defer();
			var i = 0;
			(function progress() {
				i += 10;
				$timeout(function() {
					if (i < 100) {
						progress();
					} else {
						defer.resolve();
					}
				}, 200);
			})();
			return defer.promise;
		}
	};
});