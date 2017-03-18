'use strict';

angular.module('leseulsteve.angular-user-auth').run(
  function ($rootScope, $state, $window, UserAuth) {

    var config = UserAuth.config;

    $rootScope.currentUser = UserAuth.getCurrentUser();

    function goToLogin() {
      $rootScope.currentUser = {};
      $rootScope.currentUser.isAuthentified = function () {
        return false;
      };
      $window.localStorage.removeItem('token');
      $window.localStorage.removeItem('token-expiration');
      $window.localStorage.removeItem('user');
      $state.go(config.loginStateName);
    }

    if (!$rootScope.currentUser) {
      goToLogin();
    }

    $rootScope.$on('$stateChangeStart', function (event, toState) {
      if (!$rootScope.currentUser.isAuthentified() && !_.includes(config.authorizedRoutes, toState.name) && toState.name !== config.loginStateName) {
        event.preventDefault();
        goToLogin();
      }
    });

    $rootScope.$on('UserAuth:request:unauthorized', function () {
      goToLogin();
    });
  });
