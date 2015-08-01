'use strict';

angular.module('angular.userAuth', ['ngAnimate']);;
'use strict';

angular.module('angular.userAuth').config(

  ['$httpProvider', function($httpProvider) {

    $httpProvider.interceptors.push(
      ['$q', '$window', '$rootScope', function($q, $window, $rootScope) {
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
      }]);
  }]);

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
  });*/;
'use strict';

angular.module('angular.userAuth')
  .provider('UserAuth',
    function() {

      var config = {};

      return {

        config: function(value) {
          _.extend(config, value);
        },

        $get: ['$http', '$location', '$window', '$rootScope', function($http, $location, $window, $rootScope) {

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
            },

            isAuthentified: function() {
              return $window.localstorage.getItem('token', response.data.token.id) && new Date($window.localstorage.getItem('token-expiration')) > new Date();
            }
          };
        }]
      };
    });;
'use strict';

angular.module('angular.userAuth').directive('loginForm',
	['$animate', 'UserAuth', function($animate, UserAuth) {
		return {
			// name: '',
			// priority: 1,
			// terminal: true,
			// scope: {}, // {} = isolate, true = child, false/undefined = no change
			// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
			restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
			// template: '',
			// templateUrl: '',
			// replace: true,
			// transclude: true,
			// compile: function (tElement) {},  
			link: function(scope, element) {

				scope.signin = function(signinForm, credentials) {

					if (signinForm.$invalid && UserAuth.config.signinForm.animate) {
						$animate.addClass(element, 'shake').then(function() {
							$animate.removeClass(element, 'shake');
						});
					}

					if (signinForm.$valid) {
						UserAuth.signin(credentials);
					}
				};
			},
			// controller: function ($scope, $element) {};
		};
	}]);