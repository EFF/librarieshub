goog.provide('LibrariesHub.controllers.Home');

LibrariesHub.controllers.Home = function ($scope, $http){
    $scope.query = '';
    $scope.books = [];
    $scope.busy = false;

    $scope.submit = function(){
        $scope.books = [];
        $scope.firstIteration = true;

        getBooks();
    };

    $scope.next = function(){
        getBooks();
    };

    var getBooks = function(){
        if($scope.query && !$scope.busy){
            $scope.busy = true;
            $http.get('/api/search', {
                params:{
                    q: $scope.query,
                    offset: $scope.books.length
                }
            })
            .success(function(data) {
                $scope.books.push.apply($scope.books, data.books);
                $scope.busy = false;

                scrollToResultsIfFirstRequest();
            })
            .error(function(data, status){
                $scope.books = [];
                $scope.busy = false;
            });
        }
    };

    var scrollToResultsIfFirstRequest = function(){
        if($scope.firstIteration){
            var jumbotronBottom = angular.element('header').height();
            angular.element('html,body').animate({scrollTop: jumbotronBottom}, 800, 'swing');
            $scope.firstIteration = false;
        }
    };
};
