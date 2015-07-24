'use strict';

angular.module('angular.userAuth')
  .provider('UserAuth',
    function() {

      var config = {};

      return {

        config: function(value) {
          _.extend(config, value);
        },

        $get: function($http, $location, $window, $rootScope) {

          var apiUrls = {
            signin: 'signin',
            sendPasswordToken: 'send_password_token',
            changePassword: 'change_passport',
            signup: 'signup',
            confirmEmail: 'confirm_email'
          };

          _.forOwn(apiUrls, function(url, index) {
            apiUrls[index] = config.apiRoot + '/auth/' + url;
          });

          function broadCast(service, callHttp) {
            return callHttp.then(function(response) {
              $rootScope.$broadcast('UserAuth:' + service + ':success', response.data);
              return response.data;
            }).catch(function(response) {
              $rootScope.$broadcast('UserAuth:' + service + ':fail', response.data);
              return response.data;
            });
          }

          function setToken(response) {
            if (response) {
              $window.localstorage.setItem('token', response.data.token.id);
              $window.localstorage.setItem('token-expiration', response.data.token.expiration);
            } else {
              var token = $location.search().token;
              $window.localstorage.setItem('token', token);
            }
          }

          return {

            config: config,

            signin: function(credentials) {
              return $http.post(apiUrls.signin, credentials).then(function(response) {
                setToken(response);
                $rootScope.$broadcast('UserAuth:signin:success', response.data.user);
              }).catch(function(response) {
                $rootScope.$broadcast('UserAuth:signin:fail', response.data);
              });
            },

            sendPasswordToken: function(username) {
              return broadCast('sendPasswordToken', $http.post(apiUrls.sendPasswordToken, {
                username: username,
                urlRedirection: config.sendPasswordToken.urlRedirection
              }));
            },

            changePassword: function(newPassword) {
              setToken();
              return broadCast('changePassword', $http.post(apiUrls.changePassword, {
                newPassword: newPassword
              }));
            },

            signup: function(newUser) {
              return broadCast('signup', $http.post(apiUrls.signup, {
                newUser: newUser,
                urlRedirection: config.confirmEmail.urlRedirection
              }));
            },

            confirmEmail: function() {
              setToken();
              return broadCast('confirmEmail', $http.post(apiUrls.confirmEmail));
            }
          };
        }
      };
    });