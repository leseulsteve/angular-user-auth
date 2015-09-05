angular.module('leseulsteve.angular-user-auth').run(
	function($rootScope, UserAuth) {

		$rootScope.currentUser = UserAuth.getCurrentUser();
	});