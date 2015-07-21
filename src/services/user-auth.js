'use strict';

angular.module('leseulsteve.userAuth')
  .provider('UserAuth',
    function() {

      var config = {};

      return {

        config: function(value) {
          _.extend(config, value);
        },

        $get: function($http, localStorageService, $rootScope) {
          
          return {

            config: config,

            login: function(credentials) {
              return $http.post(config.backend.paths.login, credentials).then(function(response) {
                localStorageService.set('token', response.data.token.id);
                localStorageService.set('token-expiration', response.data.token.expiration);
                $rootScope.$broadcast('UserAuth:login:success', credentials);
              });
            }
          };
        }
      };
    });