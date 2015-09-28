angular.module('generic.services').factory('PhotoUploadService', function($q, $timeout, $http) {
	var _variables = {};

	function config() {
		_variables = {
			uploadURI : encodeURI('http://' + window.variables.serverIP + ':' + window.variables.serverPort + '/upload'),
			checkExistURI : 'http://' + window.variables.serverIP + ':' + window.variables.serverPort + '/isexist',
			phoneNumber : window.variables.phoneNumber
		};
	}

	config();

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
							uuid : _variables.phoneNumber
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
							} else {
								navigator.notification.alert('同步完成！', null, '提示');
							}
						}, function(error) {
							navigator.notification.alert(error, null, '错误');
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
				uuid : _variables.phoneNumber,
				date : (function() {
					var date = new Date(file.lastModified);
					return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
				})()
			};

			this.isExist(properties).then(function(response) {
				if (response.data.success) {
					progress.name += ' ' + response.data.message;
					defer.resolve();
				} else {
					var ft = new FileTransfer();
					ft.onprogress = function(progressEvent) {
						if (progressEvent.lengthComputable) {
							progress.updateProgress(parseInt(progressEvent.loaded / progressEvent.total * 100));
						}
					};
					ft.upload(file.localURL, _variables.uploadURI, function(response) {
						defer.resolve(response);
					}, function(error) {
						defer.reject(response);
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
				defer.reject(error);
			});

			return defer.promise;
		},
		isExist : function(fileProperties) {
			var defer = $q.defer();
			$http.post(_variables.checkExistURI, fileProperties).then(function(response) {
				defer.resolve(response);
			}, function(error) {
				defer.reject(error);
			});
			return defer.promise;
		},
		validateVariables : function(){
			if (!_variables.phoneNumber || !_variables.serverIP || !_variables.serverPort){
				return false;
			}else{
				return true;
			}
		},
		config : config
	};
});