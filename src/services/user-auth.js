'use strict';

angular.module('leseulsteve.userAuth')
  .provider('UserAuth',
    function() {

      var config = {};

      return {

        config: function(value) {
          _.extend(config, value);
        },

        $get: function($http, $location, localStorageService, $rootScope) {

          return {

            config: config,

            signin: function(credentials) {
              return $http.post(config.apiRoot + '/auth/signin', credentials).then(function(response) {
                localStorageService.set('token', response.data.token.id);
                localStorageService.set('token-expiration', response.data.token.expiration);
                $rootScope.$broadcast('UserAuth:signin:success', response.data.user);
              }).catch(function(response) {
                $rootScope.$broadcast('UserAuth:signin:fail', response.data.message);
              });
            },

            sendPasswordToken: function(username) {
              return $http.post(config.apiRoot + '/auth/send_password_token', {
                username: username,
                urlRedirection: config.sendPasswordToken.urlRedirection
              }).then(function(response) {
                $rootScope.$broadcast('UserAuth:sendPasswordToken:success');
              }).catch(function(response) {
                $rootScope.$broadcast('UserAuth:sendPasswordToken:fail', response.data.message);
              });
            },

            changePassword: function(newPassword) {
              var token = $location.search().token;
              localStorageService.set('token', token);
              return $http.post(config.apiRoot + '/auth/change_passport', {
                newPassword: newPassword
              }).then(function(response) {
                $rootScope.$broadcast('UserAuth:changePassword:success');
              }).catch(function(response) {
                $rootScope.$broadcast('UserAuth:changePassword:fail', response.data.message);
              });
            }
          };
        }
      };
    });