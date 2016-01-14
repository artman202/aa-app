angular.module('destinations.city.chosen.controller', [])

.controller('DestinationsCityChosenCtrl', ['$scope', '$localstorage', '$state', '$stateParams', '$http', '$cordovaGeolocation', '$rootScope', '$ionicScrollDelegate', '$document', '$window', '$timeout', '$ionicHistory', '$ionicLoading', '$ionicModal', function($scope, $localstorage, $state, $stateParams, $http, $cordovaGeolocation, $rootScope, $ionicScrollDelegate, $document, $window, $timeout, $ionicHistory, $ionicLoading, $ionicModal) {

  $scope.$on('$ionicView.enter', function() {
    $rootScope.showTabs = true;
    $rootScope.showBack = true;    
    $rootScope.enquireBtn = false;
  });

  $scope.state = $stateParams;

  $timeout(function(){

    $ionicLoading.show({template: $rootScope.ionSpinnerTemplate})

    $http({
      method: 'GET',
      url: 'http://www.aatravel.co.za/_mobi_app/accomm.php?city_id='+$stateParams.cityId
    }).then(function successCallback(response) {  

      $ionicLoading.hide();
      $scope.resultsLoaded = true;        

      var data = response.data;

      $scope.results = data.length;

      $scope.acommodations = data;

      var finalResultArray = $scope.acommodations;

      var distanceArray = [];
      for ( var x = 0; x < data.length; x++) {
        distanceArray.push(Math.round(getDistanceFromLatLonInKm($rootScope.myLat,$rootScope.myLong,data[x].lat,data[x].lon)));
      }
      $scope.acommodationsDistances = distanceArray;

      $scope.aaRating = calculateRating(data);

      $scope.select = "alphabetical"
      $scope.filterBy = "Alphabetically";
      $scope.openModal = function() {
        showModal($ionicModal, $scope, $rootScope, $scope.select);        
      };
      $scope.filterData = function(filterType, mySelect) {
        filter(filterType, mySelect, $scope, $rootScope);
      }
      $scope.closeModal = function() {
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
        $scope.modal.hide();
      };

      $scope.controllerMapView = function() {
        
        $localstorage.set("closeTab", "true")
        $localstorage.set("type", "acomm")
        var cityName = $stateParams.cityName;            
        $localstorage.set("acommName", cityName);
        $localstorage.setObject("acommData", data);
        $state.go('app.map-view');

      }

    }, function errorCallback(response) {

      navigator.notification.alert(
        'We regret that there is a problem retrieving the cities.',  // message
        null,                     // callback
        'Alert',                // title
        'Done'                  // buttonName
      );

    });

    // }

  }, $rootScope.contentTimeOut);

  // };

}])