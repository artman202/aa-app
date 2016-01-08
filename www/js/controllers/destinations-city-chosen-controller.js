angular.module('destinations.city.chosen.controller', [])

.controller('DestinationsCityChosenCtrl', ['$scope', '$localstorage', '$state', '$stateParams', '$http', '$cordovaGeolocation', '$rootScope', '$ionicScrollDelegate', '$document', '$window', '$timeout', '$ionicHistory', '$ionicLoading', '$ionicModal', function($scope, $localstorage, $state, $stateParams, $http, $cordovaGeolocation, $rootScope, $ionicScrollDelegate, $document, $window, $timeout, $ionicHistory, $ionicLoading, $ionicModal) {

  $scope.$on('$ionicView.beforeEnter', function() {
  });

  $scope.$on('$ionicView.enter', function() {

    // $localstorage.resetAcommData(true);
    $rootScope.showTabs = true;
    $rootScope.showBack = true;    
    $rootScope.enquireBtn = false;
    $rootScope.showMapBtn = true;
    
    // if($localstorage.getObject("acommData").length > 0) {     
    // } else {
    //   reloadPage()
    // }

    // if($rootScope.showMap == true) {
    //   $timeout(function(){
    //     var mapBtn = angular.element(document.getElementsByClassName('map-view-btn'));
    //     mapBtn.addClass('yellow-activated');
    //   }, 100);      
    // } else {
    //   $timeout(function(){
    //     var listBtn = angular.element(document.getElementsByClassName('list-view-btn'));
    //     listBtn.addClass('yellow-activated');
    //     var mapBtn = angular.element(document.getElementsByClassName('map-view-btn'));
    //     mapBtn.removeClass('yellow-activated');
    //   }, 100);
    // }

  });

  $scope.state = $stateParams;

  // function useData(data) {
  //   // alert("Use data")
  //   $timeout(function(){

  //     $scope.state.cityName = $localstorage.get("acommName");

  //     $scope.results = data.length;

  //     $scope.acommodations = data;
  //     var finalResultArray = $scope.acommodations;

  //     var distanceArray = [];
  //     for ( var x = 0; x < data.length; x++) {
  //       console.log("distance")
  //       distanceArray.push(Math.round(getDistanceFromLatLonInKm($rootScope.myLat,$rootScope.myLong,data[x].lat,data[x].lon)));
  //     }
  //     $scope.acommodationsDistances = distanceArray;

  //     $scope.aaRating = calculateRating(data);

  //     $scope.select = "alphabetical"
  //     $scope.filterBy = "Alphabetically";
  //     $scope.openModal = function() {
  //       showModal($ionicModal, $scope, $rootScope, $scope.select);        
  //     };
  //     $scope.filterData = function(filterType, mySelect) {
  //       filter(filterType, mySelect, $scope, $rootScope);
  //     }
  //     $scope.closeModal = function() {
  //       runFilter($scope, finalResultArray, $rootScope, $ionicScrollDelegate)
  //       $scope.acommodations = $scope.filteredData;
  //       $scope.results = $scope.filteredData.length;
  //       if($scope.results == 0) {
  //         angular.element(document.getElementsByClassName('end-text')).html("No results found")
  //       } else {
  //         angular.element(document.getElementsByClassName('end-text')).html("No more results")
  //       }
  //       $scope.acommodationsDistances = $scope.distanceArray;
  //       $scope.aaRating = $scope.aaRatingArray;
  //       $scope.modal.hide();
  //     };

  //     $rootScope.controllerMapView = function() {
        
  //       $localstorage.setObject("acommState", $stateParams);
  //       $localstorage.setObject("acommData", data);
  //       $state.go('app.map-view');

  //     }

  //   }, $rootScope.contentTimeOut);
  // }

  // function reloadPage() {

    // alert("Reload page")

    $timeout(function(){ 

      // alert($localstorage.get("acommName"))

      $ionicLoading.show({template: '<ion-spinner icon="dots"></ion-spinner>'})

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
              angular.element(document.getElementsByClassName('end-text')).html("No results found")
            } else {
              angular.element(document.getElementsByClassName('end-text')).html("No more results")
            }
            $scope.acommodationsDistances = $scope.distanceArray;
            $scope.aaRating = $scope.aaRatingArray;
            $scope.modal.hide();
          };

          $scope.controllerMapView = function() {
            
            var cityName = $stateParams.cityName;            
            $localstorage.set("acommName", cityName);
            $localstorage.setObject("acommData", data);
            $state.go('app.map-view');

          }

          // $rootScope.controllerListView = function() {

          //   alert("hello");

          //   // $state.go('app.destinations-city-chosen');

          //   // var listBtn = angular.element(document.getElementsByClassName('list-view-btn'));
          //   // listBtn.addClass('yellow-activated');

          //   // var mapBtn = angular.element(document.getElementsByClassName('map-view-btn'));
          //   // mapBtn.removeClass('yellow-activated');

          //   // $rootScope.showMap = false;

          //   // $rootScope.$broadcast('loading:show');

          //   // $timeout(function(){
          //   //   $rootScope.$broadcast('loading:hide');
          //   // }, 500);

          // }           

          // loadItemsByScroll("accommodation", $scope, $ionicScrollDelegate, $rootScope, data, $window, $timeout)

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