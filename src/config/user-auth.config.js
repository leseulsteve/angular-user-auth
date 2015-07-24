'use strict';

angular.module('angular.userAuth').config(

  function($httpProvider) {

    $httpProvider.interceptors.push(
      function($q, $window, $rootScope) {
        return {

          request: function(config) {
            config.headers = config.headers || {};
            var token = $window.localstorage.getItem('token');
            if (token) {
              config.headers.Authorization = 'Bearer ' + token;
            }
            return config;
          },

          responseError: function(rejection) {
            switch (rejection.status) {
              case 401:
                $rootScope.$broadcast('UserAuth:request:unauthorized', rejection);
                break;
            }

            return $q.reject(rejection);
          }
        };
      });
  });

/*angular.module('leseulsteve.userAuth').run(

  /*function ($rootScope, IAMUserAuth, $state, $location) {

    function goToLogin(toParams) {
      $state.go(IAMUserAuth.config.loginStateName, toParams);
    }

    function autoLogin(toState, toParams) {
      IAMUserAuth.login(IAMUserAuth.config.autoLogin).then(function () {
        if (toState.name === IAMUserAuth.config.loginStateName) {
          $location.path('/');
        } else {
          $state.go(toState.name, toParams);
        }
      });
    }

    $rootScope.$on('$stateChangeStart',
      function (event, toState, toParams) {

        if (!IAMUserAuth.isAuthentified()) {

          if (IAMUserAuth.config.autoLogin) {
            event.preventDefault();
            autoLogin(toState, toParams);

          } else if (IAMUserAuth.config.loginStateName && toState.name !== IAMUserAuth.config.loginStateName) {
            event.preventDefault();
            goToLogin(toParams);
          }
        }
      });
  });*/