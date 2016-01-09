angular.module('map.view.controller', [])

.controller('MapViewCtrl', ['$scope', '$localstorage', '$state', '$stateParams', '$http', '$cordovaGeolocation', '$rootScope', '$ionicScrollDelegate', '$document', '$window', '$timeout', '$ionicHistory', '$ionicLoading', '$ionicModal', function($scope, $localstorage, $state, $stateParams, $http, $cordovaGeolocation, $rootScope, $ionicScrollDelegate, $document, $window, $timeout, $ionicHistory, $ionicLoading, $ionicModal) {

  $scope.$on('$ionicView.enter', function() {

    $rootScope.showTabs = true;
    $rootScope.showBack = true;    
    $rootScope.enquireBtn = false;

    console.log($localstorage.get("closeTab"));

    if($localstorage.get("closeTab") == "true") {
      var markerLink = angular.element(document.getElementById('map-list-item-wrap'));
      markerLink.html("");
    }

    if ($localstorage.get("type") == "nearMe") {

      $scope.cityName = "What's Near Me";
      mapView($localstorage.getObject("nearMeData"), $rootScope, "nearme-map");

    } else if ($localstorage.get("type") == "acomm") {

      $scope.cityName = $localstorage.get("acommName");
      mapView($localstorage.getObject("acommData"), $rootScope, "accommodation-map");

    }     
      
  });

  $scope.$on('$ionicView.afterLeave', function() {
    $localstorage.set("closeTab", "false")
  })

  $scope.controllerListView = function() {
    
    $ionicHistory.goBack();

  }

}])