angular.module('leseulsteve.angular-user-auth').directive('signupForm',
	function(UserAuth) {
		return {
			restrict: 'A',
			link: function(scope, element) {

				scope.signup = function(signinForm, newUser) {

					if (signinForm.$valid) {
						UserAuth.signup(newUser);
					}
				};
			}
		};
	});