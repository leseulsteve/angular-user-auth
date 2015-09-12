'use strict';

angular.module('leseulsteve.angular-user-auth').directive('signupForm',
  function (UserAuth) {
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
  });
