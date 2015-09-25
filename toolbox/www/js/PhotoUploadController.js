angular.module('generic.controllers', []).controller('PhotoUploadController', function($ionicPlatform, $scope, PhotoUploadService, $ionicPopup, $timeout) {
	$ionicPlatform.ready(function() {

		$scope.progress = {
			imageSrc : null,
			currentIndex : 0,
			name : null,
			type : null,
			total : 0,
			dom : {
				progressDom : document.querySelector('#photo-upload-progress')
			},

			clear : function() {
				this.imageSrc = 'img/blank.png';
				this.dom.progressDom.value = 0;
			},
			updateProgress : function(val) {
				this.dom.progressDom.value = val;
			}
		};
		$scope.photos = [];
		var photos = [], imageDom = document.querySelector('#photo-upload-image'), gatherProgressPopup = $ionicPopup.show({
			template : '<span>已发现 {{photos.length}} 个。</span>',
			title : '发现媒体文件，请稍后！',
			scope : $scope
		});
		
		PhotoUploadService.gatherPhotos($scope.photos).then(function(){
			$timeout(function(){
				gatherProgressPopup.close();
			}, 1000);
		});
		
//		$timeout(function(){
//			$scope.photos.push('1');
//			$timeout(function(){
//				gatherProgressPopup.close();
//			}, 1000);
//		}, 1000);

//		$scope.$watch('progress.imageSrc', function(newVal, oldVal) {
//			if (newVal) {
//				imageDom.src = newVal;
//			} else {
//				imageDom.src = 'img/blank.png';
//			}
//		});

	});
});