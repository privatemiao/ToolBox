angular.module('generic', [ 'ionic', 'ngCordova', 'ngIOS9UIWebViewPatch', 'generic.controllers', 'generic.services' ])

.run(function($ionicPlatform, $rootScope) {
	$ionicPlatform.ready(function() {
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			StatusBar.styleDefault();
		}

		var variables = localStorage.getItem('variables');
		if (variables) {
			window.variables = JSON.parse(variables);
		} else {
			window.variables = {
				phoneNumber : device.uuid,
				serverIP : '192.168.8.100',
				serverPort : '8888'
			};
		}
	});
}).config(function($stateProvider, $urlRouterProvider) {
	$stateProvider.state('tab', {
		url : '/tab',
		abstract : true,
		templateUrl : 'partial/tabs.html'
	})

	.state('tab.photo', {
		url : '/photo',
		views : {
			'tab-photo' : {
				templateUrl : 'partial/tab-photo.html'
			}
		}
	}).state('tab.photo-upload', {
		url : '/photo/upload',
		views : {
			'tab-photo' : {
				templateUrl : 'partial/tab-photo-upload.html',
				controller : 'PhotoUploadController'
			}
		}
	}).state('tab.photo-view', {
		url : '/photo/view',
		views : {
			'tab-photo' : {
				templateUrl : 'partial/tab-photo-view.html'
			}
		}
	})

	.state('tab.contact', {
		url : '/contact',
		views : {
			'tab-contact' : {
				templateUrl : 'partial/tab-contact.html'
			}
		}
	}).state('tab.setting', {
		url : '/setting',
		views : {
			'tab-setting' : {
				templateUrl : 'partial/tab-setting.html',
				controller : 'SettingController'
			}
		}
	})

	$urlRouterProvider.otherwise('/tab/photo');
});

angular.module('generic.controllers', []);
angular.module('generic.services', []);

angular.module('ngIOS9UIWebViewPatch', [ 'ng' ]).config([ '$provide', function($provide) {
	'use strict';

	$provide.decorator('$browser', [ '$delegate', '$window', function($delegate, $window) {

		if (isIOS9UIWebView($window.navigator.userAgent)) {
			return applyIOS9Shim($delegate);
		}

		return $delegate;

		function isIOS9UIWebView(userAgent) {
			return /(iPhone|iPad|iPod).* OS 9_\d/.test(userAgent) && !/Version\/9\./.test(userAgent);
		}

		function applyIOS9Shim(browser) {
			var pendingLocationUrl = null;
			var originalUrlFn = browser.url;

			browser.url = function() {
				if (arguments.length) {
					pendingLocationUrl = arguments[0];
					return originalUrlFn.apply(browser, arguments);
				}

				return pendingLocationUrl || originalUrlFn.apply(browser, arguments);
			};

			window.addEventListener('popstate', clearPendingLocationUrl, false);
			window.addEventListener('hashchange', clearPendingLocationUrl, false);

			function clearPendingLocationUrl() {
				pendingLocationUrl = null;
			}

			return browser;
		}
	} ]);
} ]);
