angular.module('map.view.controller', [])

.controller('MapViewCtrl', ['$scope', '$localstorage', '$state', '$stateParams', '$http', '$cordovaGeolocation', '$rootScope', '$ionicScrollDelegate', '$document', '$window', '$timeout', '$ionicHistory', '$ionicLoading', '$ionicModal', function($scope, $localstorage, $state, $stateParams, $http, $cordovaGeolocation, $rootScope, $ionicScrollDelegate, $document, $window, $timeout, $ionicHistory, $ionicLoading, $ionicModal) {

  $scope.$on('$ionicView.enter', function() {

    // $localstorage.resetAcommData(true);
    $rootScope.showTabs = true;
    $rootScope.showBack = true;    
    $rootScope.enquireBtn = false;
    $rootScope.showMapBtn = true;

    $scope.cityName = $localstorage.get("acommName");
    mapView($localstorage.getObject("acommData"), $rootScope, "accommodation-map");

  });

  $scope.controllerListView = function() {
    
    $ionicHistory.goBack();

  }

}])