angular.module('home.controller', [])

.controller('HomeCtrl', ['$scope', '$rootScope', '$ionicHistory', '$interval', '$http', '$window', '$timeout', '$ionicLoading', function($scope, $rootScope, $ionicHistory, $interval, $http, $window, $timeout, $ionicLoading) {

  $rootScope.positionAvailable = true;

  $scope.$on('$ionicView.enter', function() {
    $rootScope.showTabs = false;
    $rootScope.showBack = false;
  });

  // destinations
  $scope.showSpiralCity = true;

  $http({
    method: 'GET',
    url: 'http://www.aatravel.co.za/_mobi_app/accomm_search.php'
  }).then(function successCallback(response) {    

    // deactivate loader
    $scope.showSpiralCity = false;

    var data = response.data;
    var cityArrayImg = [];

    for(var x = 0; x < data.length; x++) {

      switch(data[x].city) {
        case 'Cape Town':
          cityArrayImg.push("img/home-top-des/cape-town.jpg");
          break;
        case 'Pretoria':
          cityArrayImg.push("img/home-top-des/pretoria.jpg");
          break;
        case 'Durban':
          cityArrayImg.push("img/home-top-des/durban.jpg");
          break;
        case 'Kimberley':
          cityArrayImg.push("img/home-top-des/kimberley.jpg");
          break;
        case 'East London':
          cityArrayImg.push("img/home-top-des/east-london.jpg");
          break;
        case 'Queenstown':
          cityArrayImg.push("img/home-top-des/queenstown.jpg");
          break;
        case 'Port Elizabeth':
          cityArrayImg.push("img/home-top-des/port-elizabeth.jpg");
          break;
        case 'Ballito':
          cityArrayImg.push("img/home-top-des/ballito.jpg");
          break;
        default:
          cityArrayImg.push("error");
          break;
      }
    }

    $scope.cityArrayImg = cityArrayImg;    
    $scope.topDestinationArray = data;    

  }, function errorCallback(response) {

    navigator.notification.alert(
      'We regret that there was a problem retrieving the top destinations.',  // message
      null,                     // callback
      'Alert',                // title
      'Done'                  // buttonName
    );

  });
  
  // featured acommodation
  $scope.showSpiralReccom = true;

  $http({
    method: 'GET',
    url: 'http://www.aatravel.co.za/_mobi_app/accomm.php?featured=1&use_cache=0'
  }).then(function successCallback(response) {      

    $scope.showSpiralReccom = false;

    var data = response.data;
    var reccommendedAccomArray = [];
    var reccommendedAccomDistancesArray = []; 

    var highestRating = 0;

    data.sort(function(a,b) {
      return b.pv - a.pv;
    });

    var promise;
    promise = $interval(function() {

      if(typeof $rootScope.myLat !== 'undefined' || typeof $rootScope.myLong !== 'undefined') {

        $interval.cancel(promise);

        $scope.homeRecommended = true;
        for(var x = 0; x < data.length; x++) {
          data[x]["distance"] = Math.round(getDistanceFromLatLonInKm($rootScope.myLat,$rootScope.myLong,data[x].lat,data[x].lon));
        }        

      } else {

        $scope.homeRecommended = false;

      }
    }, 500);    

    $scope.reccommendedAccomArray = data;
    $scope.reccommendedAccomDistances = reccommendedAccomDistancesArray;

  }, function errorCallback(response) {

    navigator.notification.alert(
      'We regret that there was a problem retrieving the top destinations.',  // message
      null,                     // callback
      'Alert',                // title
      'Done'                  // buttonName
    );

  });

  // near me
  $scope.showSpiralNear = true;
  loadDistanceBefore($rootScope, $ionicHistory, $scope, $timeout, $interval, $http, $ionicLoading);

}])