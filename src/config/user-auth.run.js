angular.module('leseulsteve.angular-user-auth').run(
	function($rootScope, UserAuth) {

		var config = UserAuth.config;

		$rootScope.currentUser = UserAuth.getCurrentUser();

		$rootScope.$on('$stateChangeStart',
			function(event, toState, toParams) {

				if ((_.isUndefined($rootScope.currentUser) || !$rootScope.currentUser.isAuthentified()) && !_.contains(config.authorizedRoutes, toState.name)) {
					event.preventDefault();
					$state.go(config.loginStateName, toParams);
				}
			});
	});