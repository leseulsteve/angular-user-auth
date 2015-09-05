'use strict';

angular.module('leseulsteve.angular-user-auth').directive('signinForm',
	function($animate, UserAuth) {
		return {
			restrict: 'A',
			link: function(scope, element) {

				scope.signin = function(signinForm, credentials) {

					if (signinForm.$invalid && UserAuth.config.signinForm && UserAuth.config.signinForm.animate) {
						$animate.addClass(element, 'shake').then(function() {
							$animate.removeClass(element, 'shake');
						});
					}

					if (signinForm.$valid) {
						UserAuth.signin(credentials);
					}
				};
			}
		};
	});