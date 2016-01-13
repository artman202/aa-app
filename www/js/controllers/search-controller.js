angular.module('search.controller', [])

.controller('SearchCtrl', ['$scope', '$rootScope', '$http', '$ionicLoading', '$ionicHistory', '$timeout',  function($scope, $rootScope, $http, $ionicLoading, $ionicHistory, $timeout) {

  $scope.$on('$ionicView.enter', function() {

    $ionicLoading.show({template: $rootScope.ionSpinnerTemplate})

    $rootScope.showTabs = true;
    $rootScope.showBack = true;    
    $rootScope.enquireBtn = false;
  });

  $scope.search = true;
  $timeout(function(){

    $http({
      method: 'GET',
      url: 'http://www.aatravel.co.za/_mobi_app/accomm_search.php'
    }).then(function successCallback(response) {

      $ionicLoading.hide()
      $scope.topDestinationArray = response.data

    }, function errorCallback(response) {

      navigator.notification.alert(
        'We regret that there was a problem retrieving the cities.',  // message
        null,                     // callback
        'Alert',                // title
        'Done'                  // buttonName
      );

    });

  }, $rootScope.contentTimeOut);

  $scope.searchByCity = function() {

    $scope.search = false;
    $scope.noResult = false;

    $http({
      method: 'GET',
      url: 'http://www.aatravel.co.za/_mobi_app/accomm_search.php?q='+$scope.searchQuery
    }).then(function successCallback(response) {

      var searchResults = response.data;

      // if no results are found
      if(searchResults.length == 0) {
        $scope.noResult = true;
      }

      $scope.cities = response.data;

    }, function errorCallback(response) {

      navigator.notification.alert(
        'We regret that there was a problem retrieving the top destinations.',  // message
        null,                     // callback
        'Alert',                // title
        'Done'                  // buttonName
      );

    });    
  }

  $scope.closeSearch = function() {
    $ionicHistory.goBack();
  }

}])