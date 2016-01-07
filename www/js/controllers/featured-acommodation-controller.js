angular.module('featured-acommodation.controller', [])

.controller('FeaturedAcommodationCtrl', ['$scope', '$rootScope', '$timeout', '$http', '$ionicLoading', '$ionicScrollDelegate', '$window', '$ionicModal', function($scope, $rootScope, $timeout, $http, $ionicLoading, $ionicScrollDelegate, $window, $ionicModal) {
  
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
      url: 'http://www.aatravel.co.za/_mobi_app/accomm.php?featured=1&use_cache=0'
    }).then(function successCallback(response) {  

      $ionicLoading.hide();
      $scope.resultsLoaded = true;

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

      var data = response.data;

      $scope.acommodations = data;
      var finalResultArray = $scope.acommodations;

      var distanceArray = [];
      for ( var x = 0; x < data.length; x++) {
        console.log("distance")
        distanceArray.push(Math.round(getDistanceFromLatLonInKm($rootScope.myLat,$rootScope.myLong,data[x].lat,data[x].lon)));
      }
      $scope.acommodationsDistances = distanceArray;

      $scope.aaRating = calculateRating(data);

      $scope.featureSelected = false;
      $scope.filterBy = "No Filter Selected";
      $scope.openModal = function() {
        showModal($ionicModal, $scope, $rootScope);        
      };
      $scope.filterData = function(filterType, mySelect) {
        filter(filterType, mySelect, $scope, $rootScope);
      }
      $scope.closeModal = function() {
        if($scope.featureSelected != false) {

          runFilter($scope, finalResultArray, $rootScope, $ionicScrollDelegate)
          $scope.acommodations = $scope.filteredData;
          $scope.results = $scope.filteredData.length;
          if($scope.results == 0) {
            angular.element(document.getElementsByClassName('end-text')).html("No results found")
          } else {
            angular.element(document.getElementsByClassName('end-text')).html("No more results")
          }
          $scope.acommodationsDistances = $scope.distanceArray;
          $scope.aaRating = $scope.aaRatingArray;          
        }
        $scope.modal.hide();
      };      

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