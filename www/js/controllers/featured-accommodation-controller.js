angular.module('featured-accommodation.controller', [])

.controller('FeaturedAccommodationCtrl', ['$scope', '$rootScope', '$timeout', '$http', '$ionicLoading', '$ionicScrollDelegate', '$window', '$ionicModal', '$interval', function($scope, $rootScope, $timeout, $http, $ionicLoading, $ionicScrollDelegate, $window, $ionicModal, $interval) {
  
  $scope.$on('$ionicView.enter', function() {
    $rootScope.showTabs = true;
    $rootScope.showBack = true;
  });

  $scope.hide = true;
  $scope.showMap = false;

  $timeout(function(){

    $ionicLoading.show({template: $rootScope.ionSpinnerTemplate})

    $http({
      method: 'GET',
      url: 'http://www.aatravel.co.za/_mobi_app/accomm.php?featured=1&use_cache=0'
    }).then(function successCallback(response) {  

      $ionicLoading.hide();
      $scope.resultsLoaded = true;

      var data = response.data;

      // $rootScope.controllerMapView = function() {
        
      //   $scope.showMap = true;

      //   $timeout(function(){
      //     mapView(data, $rootScope, "accommodation-map");
      //   }, 500);

      // }

      // $rootScope.controllerListView = function() {

      //   $scope.showMap = false;

      //   $rootScope.$broadcast('loading:show');

      //   $timeout(function(){
      //     $rootScope.$broadcast('loading:hide');
      //   }, 500);

      // }

      $scope.results = data.length;

      var data = response.data;

      $scope.acommodations = data;
      var finalResultArray = $scope.acommodations;

      // load distances if available
      loadDistances(data, $rootScope, $interval, $scope);

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
            $scope.noRatings = true;
          } else {
            $scope.noRatings = false;
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