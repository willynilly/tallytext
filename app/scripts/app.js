'use strict';

/**
 * @ngdoc overview
 * @name tallytextApp
 * @description
 * # tallytextApp
 *
 * Main module of the application.
 */
angular
  .module('tallytextApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
		'lexerDude',
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
				controllerAs: 'mainCtrl' 
      })
			.when('/demo', {
				templateUrl: 'views/demo.html',
				controller: 'DemoCtrl',
				controllerAs: 'demoCtrl'
			})
      .otherwise({
        redirectTo: '/'
      });
  })
  .directive('activeLink', ['$location', function(location) {
     return {
       restrict: 'A',
       link: function(scope, element, attrs) {
         var clazz = attrs.activeLink;
         var path = attrs.href || attrs.ngHref;
         path = path.substring(1); //hack because path does not return including hashbang
         scope.location = location;
         scope.$watch('location.path()', function(newPath) {
					 if (path === newPath) {
             element.parent().addClass(clazz);
           } else {
             element.parent().removeClass(clazz);
           }
					 if (path === '' && newPath === '/') {
             element.parent().addClass(clazz);
					 }
         });
       }
     };
   }]);
