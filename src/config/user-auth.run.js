angular.module('leseulsteve.angular-user-auth').run(
	function($rootScope, $state, UserAuth) {

		var config = UserAuth.config;

		$rootScope.currentUser = UserAuth.getCurrentUser();
		if (!$rootScope.currentUser) {
			$rootScope.currentUser = {};
			$rootScope.currentUser.isAuthentified = function() {
				return false;
			}
		}

		$rootScope.$on('$stateChangeStart',
			function(event, toState, toParams) {

				if (!$rootScope.currentUser.isAuthentified() && !_.contains(config.authorizedRoutes, toState.name) && toState.name !== config.loginStateName) {
					event.preventDefault();
					$state.go(config.loginStateName, toParams);
				}
			});
	});