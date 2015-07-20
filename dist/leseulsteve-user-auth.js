'use strict';

angular.module('leseulsteve.userAuth', ['ngAnimate', 'LocalStorageModule']);;
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
			restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
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