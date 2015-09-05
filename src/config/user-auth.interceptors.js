'use strict';

angular.module('leseulsteve.angular-user-auth').config(

  function($httpProvider) {

    $httpProvider.interceptors.push(
      function($q, $window, $rootScope) {
        return {

          request: function(config) {
            config.headers = config.headers || {};
            var token = $window.localStorage.getItem('token');
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