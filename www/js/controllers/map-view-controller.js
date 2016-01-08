angular.module('map.view.controller', [])

.controller('MapViewCtrl', ['$scope', '$localstorage', '$state', '$stateParams', '$http', '$cordovaGeolocation', '$rootScope', '$ionicScrollDelegate', '$document', '$window', '$timeout', '$ionicHistory', '$ionicLoading', '$ionicModal', function($scope, $localstorage, $state, $stateParams, $http, $cordovaGeolocation, $rootScope, $ionicScrollDelegate, $document, $window, $timeout, $ionicHistory, $ionicLoading, $ionicModal) {

  $scope.$on('$ionicView.enter', function() {

    // $localstorage.resetAcommData(true);
    $rootScope.showTabs = true;
    $rootScope.showBack = true;    
    $rootScope.enquireBtn = false;
    $rootScope.showMapBtn = true;

    // console.log(angular.element(document.getElementById("map")).html());

    // if(angular.element(document.getElementById("map")).html() == '<div style="overflow: hidden;"></div>') {
    //   alert("No content")
    //   mapView($localstorage.getObject("acommData"), $rootScope, "accommodation-map");
    // }

    // <div style="overflow: hidden;"> </div>

      $scope.cityName = $localstorage.get("acommName");
      mapView($localstorage.getObject("acommData"), $rootScope, "accommodation-map");
      
  });



  $scope.controllerListView = function() {
    
    $ionicHistory.goBack();

  }

}])