angular.module('generic.controllers', []).controller('PhotoUploadController', function($ionicPlatform, $scope, PhotoUploadService, $ionicPopup, $timeout) {
	$ionicPlatform.ready(function() {
		$scope.progress = 0;
		$scope.photos = [];
		
		var progressPopup = $ionicPopup.show({
			template : '<span>已发现 {{photos.length}} 个。</span>',
			title : '发现媒体文件，请稍后！',
			scope : $scope
		});

		PhotoUploadService.gatherMediaFiles($scope, function() {
			$timeout(function() {
				progressPopup.close();
			}, 500);
		});

	});
});