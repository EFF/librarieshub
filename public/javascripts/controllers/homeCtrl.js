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
                    from: $scope.books.length
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
            var headerBottom = angular.element('header').outerHeight();
            angular.element('body,html').animate({scrollTop: headerBottom}, 600, 'swing');
            $scope.firstIteration = false;
        }
    };
};
