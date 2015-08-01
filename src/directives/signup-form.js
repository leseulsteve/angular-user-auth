angular.module('angular.userAuth').directive('signupForm',
	function(UserAuth) {
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

				scope.signup = function(signinForm, newUser) {

					if (signinForm.$valid) {
						UserAuth.signup(newUser);
					}
				};
			},
			// controller: function ($scope, $element) {};
		};
	});