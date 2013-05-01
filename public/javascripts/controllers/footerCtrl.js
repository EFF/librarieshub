goog.provide('LibrariesHub.controllers.Footer');

LibrariesHub.controllers.Footer = function ($scope){
    $scope.scrollTop = function(){
        angular.element('html,body').animate({scrollTop: 0}, 300, 'swing');
    };
};
