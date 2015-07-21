'use strict';

angular.module('leseulsteve.userAuth').directive('loginForm',
	function($animate, UserAuth) {
		return {
			// name: '',
			// priority: 1,
			// terminal: true,
			// scope: {}, // {} = isolate, true = child, false/undefined = no change
			// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
			restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
			// template: '',
			// templateUrl: '',
			// replace: true,
			// transclude: true,
			// compile: function (tElement) {},  
			link: function(scope, element) {

				scope.signin = function(signinForm, credentials) {

					if (signinForm.$invalid && UserAuth.config.signinForm.animate) {
						$animate.addClass(element, 'shake').then(function() {
							$animate.removeClass(element, 'shake');
						});
					}

					if (signinForm.$valid) {
						UserAuth.signin(credentials);
					}
				};
			},
			// controller: function ($scope, $element) {};
		};
	});