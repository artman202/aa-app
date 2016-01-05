angular.module('recommended.controller', [])

.controller('RecommendedCtrl', ['$scope', '$rootScope', '$timeout', '$http', '$ionicLoading', '$ionicScrollDelegate', '$window', function($scope, $rootScope, $timeout, $http, $ionicLoading, $ionicScrollDelegate, $window) {
  
  $scope.$on('$ionicView.enter', function() {
    $rootScope.showTabs = true;
    $rootScope.showBack = true;    
    $rootScope.enquireBtn = false;
    $rootScope.showMapBtn = false;
  });

  $scope.hide = true;
  $scope.showMap = false;

  $timeout(function(){

    $ionicLoading.show({template: '<ion-spinner icon="dots"></ion-spinner>'})

    $http({
      method: 'GET',
      url: 'http://www.aatravel.co.za/_mobi_app/accomm.php'
    }).then(function successCallback(response) {  

      $ionicLoading.hide()       

      var data = response.data;

      $rootScope.controllerMapView = function() {

        $ionicHistory.clearCache();
        $scope.showMap = true;

        $timeout(function(){
          mapView(data, $rootScope, "accommodation-map", $ionicHistory);
        }, 500);

      }

      $rootScope.controllerListView = function() {

        $scope.showMap = false;

        $rootScope.$broadcast('loading:show');

        $timeout(function(){
          $rootScope.$broadcast('loading:hide');
        }, 500);

      }

      $scope.results = data.length;

      loadItemsByScroll("recommended", $scope, $ionicScrollDelegate, $rootScope, data, $window, $timeout)

    }, function errorCallback(response) {

      navigator.notification.alert(
        'We regret that there is a problem retrieving the cities.',  // message
        null,                     // callback
        'Alert',                // title
        'Done'                  // buttonName
      );

    });

  }, $rootScope.contentTimeOut);

}])

.controller('SpecialsCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
  
  $scope.$on('$ionicView.enter', function() {
    $rootScope.showTabs = true;
    $rootScope.showBack = true;    
    $rootScope.enquireBtn = false;
    $rootScope.showMapBtn = false;
  });

}])