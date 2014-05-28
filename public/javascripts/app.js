
goog.provide('LibrariesHub.Application');

goog.require('LibrariesHub.controllers.Home');
goog.require('LibrariesHub.controllers.Menu');

goog.require('LibrariesHub.directives.Book')

LibrariesHub.Application = function() {};

LibrariesHub.Application.prototype.start = function() {
    var module = angular.module('librariesHub', ['infinite-scroll', 'ui.bootstrap']);

    module.controller('HomeCtrl', ['$scope', '$http', LibrariesHub.controllers.Home])
        .controller('MenuCtrl', ['$scope', LibrariesHub.controllers.Menu])

    module.directive('book', LibrariesHub.directives.Book);
};

goog.exportSymbol('LibrariesHub', LibrariesHub);
goog.exportSymbol('LibrariesHub.Application', LibrariesHub.Application);
goog.exportProperty(LibrariesHub.Application, 'start', LibrariesHub.Application.prototype.start);

