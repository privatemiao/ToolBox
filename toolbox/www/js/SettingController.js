angular.module('generic.controllers').controller('SettingController', function($ionicPlatform, $scope, $ionicPopup, $timeout) {
	$ionicPlatform.ready(function() {
		$scope.variables = {
			phoneNumber : '13451567003'
		};
	});
});