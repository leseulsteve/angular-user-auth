'use strict';

angular.module('leseulsteve.userAuth')
  .provider('UserAuth',
    function() {

      var config = {};

      return {

        config: function(value) {
          _.extend(config, value);
        },

        $get: function($rootScope) {
          
          return {

            config: config,

            login: function(credentials) {
              $rootScope.$broadcast('UserAuth:login:success', credentials);
            }
          };
        }

      };
    });