angular.module('generic.controllers').controller('SettingController', function($ionicPlatform, PhotoUploadService, $scope, $rootScope, $ionicPopup, $timeout) {
	$ionicPlatform.ready(function() {
		if (window.variables){
			$scope.variables = window.variables;
		}
		
		$rootScope.$on('$ionicView.leave', function(event, view) {
			if (view.stateName === 'tab.setting'){
				window.variables = angular.copy($scope.variables);
				localStorage.setItem('variables', JSON.stringify(window.variables));
				PhotoUploadService.config();
			}
		});
	});
});