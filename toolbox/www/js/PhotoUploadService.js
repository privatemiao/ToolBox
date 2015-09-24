angular.module('generic.services', []).factory('PhotoUploadService', function($q) {
	return {
		echo : function() {
			console.log('Here is Echo from Service.');
		},
		gatherMediaFiles : function($scope, callback){
			$scope.photos = [];
			CameraRoll.getPhotos(function(photo){
				if (photo){
					$scope.photos.push(photo);
				}else{
					callback();
				}
			});
		}
	};
});