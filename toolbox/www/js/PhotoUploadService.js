angular.module('generic.services', []).factory('PhotoUploadService', function($q, $timeout, $http) {
	var UPLOAD_URI = encodeURI('http://192.168.8.100:8888/upload'), CHECK_EXIST_URI = 'http://192.168.8.100:8888/isexist';
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
						progress.imageSrc = f.localURL;
						progress.updatePhoto();
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
			progress.clear();
			var defer = $q.defer();

			var properties = {
				name : file.name,
				lastModified : file.lastModified,
				size : file.size,
				type : file.type,
				uuid : device.uuid
			};

			this.isExist(properties).then(function(response) {
				if (response) {
					console.log('该文件已经同步过！');
					defer.resolve();
				} else {
					var ft = new FileTransfer();
					ft.onprogress = function(progressEvent) {
						if (progressEvent.lengthComputable) {
							progress.updateProgress(parseInt(progressEvent.loaded / progressEvent.total * 100));
						}
					};
					ft.upload(file.localURL, UPLOAD_URI, function(response) {
						defer.resolve(response);
					}, function(error) {
						console.error('Error->', error);
					}, {
						fileKey : 'file',
						mimeType : file.type,
						fileName : file.name,
						params : {
							properties : JSON.stringify(properties)
						}
					});
				}
			}, function(error) {
				console.log('ERROR->', error);
				defer.reject(error);
			});

			return defer.promise;
		},
		isExist : function(fileProperties) {
			var defer = $q.defer();
			$http.post(CHECK_EXIST_URI, fileProperties).then(function(response) {
				defer.resolve(response.data.success);
			}, function(error) {
				defer.reject(error);
			});
			return defer.promise;
		}
	};
});