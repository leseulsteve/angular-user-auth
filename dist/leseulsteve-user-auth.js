'use strict';

angular.module('leseulsteve.userAuth', ['ngAnimate', 'LocalStorageModule']);;
'use strict';

angular.module('leseulsteve.userAuth').config(

  ['localStorageServiceProvider', '$httpProvider', function (localStorageServiceProvider, $httpProvider) {

    localStorageServiceProvider.setPrefix('userAuth');

    $httpProvider.interceptors.push(['$q', '$window', '$rootScope',
      function ($q, localStorageService, $rootScope) {
        return {

          request: function (config) {
            config.headers = config.headers || {};
            var tokenId = localStorageService.get('token');
            if (token) {
              config.headers.Authorization = 'Bearer ' + JSON.parse(token);
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
      }
    ]);
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

angular.module('leseulsteve.userAuth')
  .provider('UserAuth',
    function() {

      var config = {};

      return {

        config: function(value) {
          _.extend(config, value);
        },

        $get: ['$http', 'localStorageService', '$rootScope', function($http, localStorageService, $rootScope) {
          
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
        }]

      };
    });;
'use strict';

angular.module('leseulsteve.userAuth').directive('loginForm',
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

				scope.login = function(loginForm, credentials) {

					if (loginForm.$invalid && UserAuth.config.loginForm.animate) {
						$animate.addClass(element, 'shake').then(function() {
							$animate.removeClass(element, 'shake');
						});
					}

					if (loginForm.$valid) {
						UserAuth.login(credentials);
					}
				};
			},
			// controller: function ($scope, $element) {};
		};
	}]);