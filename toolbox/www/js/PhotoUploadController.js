angular.module('generic.controllers', []).controller('PhotoUploadController', function($ionicPlatform, $scope, PhotoUploadService, $ionicPopup, $timeout) {
	$ionicPlatform.ready(function() {
		
		var progressDom = document.querySelector('#photo-upload-progress'), imageDom = document.querySelector('#photo-upload-image');
		$scope.progress = {
			imageSrc : 'img/blank.png',
			currentIndex : 0,
			name : null,
			type : null,

			clear : function() {
				this.updateProgress(0);
			},
			updateProgress : function(val) {
				progressDom.value = val;
			},
			updatePhoto : function(){
				if (this.type === 'video'){
					imageDom.src = 'img/video-placeholder.jpg';
				}else{
					imageDom.src = this.imageSrc;
				}
			}
		};
		$scope.photos = [];
		var photos = [], gatherProgressPopup = $ionicPopup.show({
			template : '<span>已发现 {{photos.length}} 个。</span>',
			title : '发现媒体文件，请稍后！',
			scope : $scope
		});

		PhotoUploadService.gatherPhotos($scope.photos).then(function() {
			$timeout(function() {
				gatherProgressPopup.close();
				if ($scope.photos.length === 0) {
					navigator.notification.alert('没有找到照片！', null, '提示');
					return;
				}
				$timeout(function() {
					navigator.notification.confirm('请在WIFI环境下使用！', function(result) {
						if (result !== 1) {
							return;
						}
						PhotoUploadService.uploadPhotos($scope.photos, $scope.progress);
					}, '确认？', [ '上传', '取消' ]);
				}, 200);
			}, 1000);
		});

	});
});