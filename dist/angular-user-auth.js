'use strict';

angular.module('leseulsteve.angular-user-auth', ['ngAnimate']);
;
'use strict';

angular.module('leseulsteve.angular-user-auth').config(

  ['$httpProvider', function ($httpProvider) {

    $httpProvider.interceptors.push(
      ['$q', '$window', '$rootScope', function ($q, $window, $rootScope) {
        return {

          request: function (config) {
            config.headers = config.headers || {};
            var token = $window.localStorage.getItem('token');
            if (token) {
              config.headers.Authorization = 'Bearer ' + token;
            }
            return config;
          },

          responseError: function (rejection) {
            switch (rejection.status) {
            case 401:
              $rootScope.$broadcast('UserAuth:request:unauthorized', rejection);
              break;
            }

            return $q.reject(rejection);
          }
        };
      }]);
  }]);
;
'use strict';

angular.module('leseulsteve.angular-user-auth').run(
  ['$rootScope', '$state', 'UserAuth', function ($rootScope, $state, UserAuth) {

    var config = UserAuth.config;

    $rootScope.currentUser = UserAuth.getCurrentUser();
    if (!$rootScope.currentUser) {
      $rootScope.currentUser = {};
      $rootScope.currentUser.isAuthentified = function () {
        return false;
      };
    }

    $rootScope.$on('$stateChangeStart',
      function (event, toState, toParams) {

        if (!$rootScope.currentUser.isAuthentified() && !_.contains(config.authorizedRoutes, toState.name) && toState.name !== config.loginStateName) {
          event.preventDefault();
          $state.go(config.loginStateName, toParams);
        }
      });
  }]);
;
'use strict';

angular.module('leseulsteve.angular-user-auth').directive('passwordVerify', function () {
  return {
    require: 'ngModel',
    scope: {
      passwordVerify: '='
    },
    link: function (scope, element, attrs, ctrl) {

      scope.$watch(function () {
        var combined;

        if (scope.passwordVerify || ctrl.$viewValue) {
          combined = scope.passwordVerify + '_' + ctrl.$viewValue;
        }
        return combined;
      }, function (value) {
        if (value) {
          ctrl.$parsers.unshift(function (viewValue) {
            var origin = scope.passwordVerify;
            if (origin !== viewValue) {
              ctrl.$setValidity('passwordVerify', false);
              return undefined;
            } else {
              ctrl.$setValidity('passwordVerify', true);
              return viewValue;
            }
          });
        }
      });
    }
  };
});
;
'use strict';

angular.module('leseulsteve.angular-user-auth').directive('signinForm',
  ['$animate', 'UserAuth', function ($animate, UserAuth) {
    return {
      restrict: 'A',
      link: function (scope, element) {

        scope.signin = function (signinForm, credentials) {

          if (signinForm.$invalid && UserAuth.config.signinForm && UserAuth.config.signinForm.animate) {
            $animate.addClass(element, 'shake').then(function () {
              $animate.removeClass(element, 'shake');
            });
          }

          if (signinForm.$valid) {
            UserAuth.signin(credentials);
          }
        };
      }
    };
  }]);
;
'use strict';

angular.module('leseulsteve.angular-user-auth').directive('signupForm',
  ['UserAuth', function (UserAuth) {
    return {
      restrict: 'A',
      link: function (scope) {

        scope.signup = function (signinForm, newUser) {

          if (signinForm.$valid) {
            UserAuth.signup(newUser);
          }
        };
      }
    };
  }]);
;
'use strict';

angular.module('leseulsteve.angular-user-auth')
  .provider('UserAuth',
    function () {

      var config = {};

      return {

        config: function (value) {
          _.extend(config, value);
        },

        $get: ['$http', '$location', '$window', '$rootScope', '$injector', function ($http, $location, $window, $rootScope, $injector) {

          var apiUrls = {
            signin: 'signin',
            signout: 'signout',
            sendPasswordToken: 'send_password_token',
            changePassword: 'change_passport',
            signup: 'signup',
            confirmEmail: 'confirm_email'
          };

          _.forOwn(apiUrls, function (url, index) {
            apiUrls[index] = (config.apiRoot || '') + 'auth/' + url;
          });

          function broadCast(service, callHttp) {
            return callHttp.then(function (response) {
              $rootScope.$broadcast('UserAuth:' + service + ':success', response.data);
              return response.data;
            }).catch(function (response) {
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

          UserSchema.prototype.isAuthentified = function () {
            return $window.localStorage.getItem('token') !== null && new Date($window.localStorage.getItem('token-expiration')) > new Date();
          };

          UserSchema.post('save', function (next) {
            setCurrentUser(this);
            next();
          });

          return {

            config: config,

            signin: function (credentials) {
              return $http.post(apiUrls.signin, credentials).then(function (response) {
                setToken(response);
                var user = new UserSchema(response.data.user);
                setCurrentUser(user);
                $rootScope.$broadcast('UserAuth:signin:success', user);
              }).catch(function (response) {
                $rootScope.$broadcast('UserAuth:signin:fail', response.data);
              });
            },

            signout: function () {
              return broadCast('signout', $http.post(apiUrls.signout)).then(function () {
                $window.localStorage.removeItem('token-expiration');
                $window.localStorage.removeItem('token');
                $window.localStorage.removeItem('user');
                $rootScope.currentUser = {};
                $rootScope.currentUser.isAuthentified = function () {
                  return false;
                };
              });
            },

            sendPasswordToken: function (username) {
              return broadCast('sendPasswordToken', $http.post(apiUrls.sendPasswordToken, {
                username: username,
                urlRedirection: config.sendPasswordToken.urlRedirection
              }));
            },

            changePassword: function (newPassword) {
              setToken();
              return broadCast('changePassword', $http.post(apiUrls.changePassword, {
                newPassword: newPassword
              }));
            },

            signup: function (newUser) {
              return broadCast('signup', $http.post(apiUrls.signup, {
                newUser: newUser,
                urlRedirection: config.confirmEmail.urlRedirection
              }));
            },

            confirmEmail: function () {
              setToken();
              return broadCast('confirmEmail', $http.post(apiUrls.confirmEmail));
            },

            getCurrentUser: function () {
              var data = $window.localStorage.getItem('user');
              return data ? new UserSchema(JSON.parse(data)) : undefined;
            }
          };
        }]
      };
    });
