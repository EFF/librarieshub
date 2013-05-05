goog.provide('LibrariesHub.controllers.Menu');

LibrariesHub.controllers.Menu = function ($scope){
    $scope.toggleMenu = function(){
        $('.nav-collapse').collapse('toggle');
    };
};
