
goog.provide('LibrariesHub.Application');

goog.require('LibrariesHub.controllers.Home');

LibrariesHub.Application = function() {};

LibrariesHub.Application.prototype.start = function() {
    var module = angular.module('librariesHub', ['infinite-scroll']);

    module.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
        $locationProvider.html5Mode(false).hashPrefix('!');
        $routeProvider
            .when('/', {redirectTo: '/home'})
            .when('/home', {controller: 'HomeCtrl', templateUrl: '/partials/home.html'});
    }]);

    module.controller('HomeCtrl', ['$scope', LibrariesHub.controllers.Home]);
};

goog.exportSymbol('LibrariesHub', LibrariesHub);
goog.exportSymbol('LibrariesHub.Application', LibrariesHub.Application);
goog.exportProperty(LibrariesHub.Application, 'start', LibrariesHub.Application.prototype.start);

