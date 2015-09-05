'use strict';

angular.module('leseulsteve.angular-user-auth')
  .provider('UserAuth',
    function() {

      var config = {};

      return {

        config: function(value) {
          _.extend(config, value);
        },

        $get: function($http, $location, $window, $rootScope, $injector) {

          var apiUrls = {
            signin: 'signin',
            signout: 'signout',
            sendPasswordToken: 'send_password_token',
            changePassword: 'change_passport',
            signup: 'signup',
            confirmEmail: 'confirm_email'
          };

          _.forOwn(apiUrls, function(url, index) {
            apiUrls[index] = (config.apiRoot || '') + 'auth/' + url;
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
              $window.localStorage.setItem('token', response.data.token.id);
              $window.localStorage.setItem('token-expiration', response.data.token.expiration);
            } else {
              var token = $location.search().token;
              $window.localStorage.setItem('token', token);
            }
          }

          function setCurrentUser(user) {
            $rootScope.currentUser = user;
            $window.localStorage.setItem('user', JSON.stringify(user));
          }

          var UserSchema = $injector.get(config.userSchema);

          UserSchema.prototype.isAuthentified = function() {
            return $window.localStorage.getItem('token') !== null && new Date($window.localStorage.getItem('token-expiration')) > new Date();
          };

          UserSchema.post('save', function(next) {
            setCurrentUser(user);
            next();
          });

          return {

            config: config,

            signin: function(credentials) {
              return $http.post(apiUrls.signin, credentials).then(function(response) {
                setToken(response);
                var user = new UserSchema(response.data.user);
                setCurrentUser(user);
                $rootScope.$broadcast('UserAuth:signin:success', user);
              }).catch(function(response) {
                $rootScope.$broadcast('UserAuth:signin:fail', response.data);
              });
            },

            signout: function() {
              return broadCast('signout', $http.post(apiUrls.signout)).then(function() {
                $window.localStorage.removeItem('token-expiration');
                $window.localStorage.removeItem('token');
                $window.localStorage.removeItem('user');
                $rootScope.currentUser = undefined;
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
            },

            getCurrentUser: function() {
              var data = $window.localStorage.getItem('user');
              return data ? new UserSchema(JSON.parse(data)) : undefined;
            }
          };
        }
      };
    });