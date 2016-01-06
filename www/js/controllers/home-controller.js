angular.module('home.controller', [])

.controller('HomeCtrl', ['$scope', '$rootScope', '$ionicHistory', '$interval', '$http', '$window', '$timeout', function($scope, $rootScope, $ionicHistory, $interval, $http, $window, $timeout) {

  $scope.$on('$ionicView.enter', function() {
    $rootScope.showTabs = false;
    $rootScope.showBack = false;
    $rootScope.enquireBtn = false;
    $rootScope.showMapBtn = false;
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
        default:
          cityArrayImg.push("error");
          break;
      }
    }

    $scope.cityArrayImg = cityArrayImg;    
    $scope.topDestinationArray = data

  }, function errorCallback(response) {

    navigator.notification.alert(
      'We regret that there was a problem retrieving the top destinations.',  // message
      null,                     // callback
      'Alert',                // title
      'Done'                  // buttonName
    );

  });
  
  // recommended
  $scope.showSpiralReccom = true;
  var promise;  
  // test if the location has been updated yet, if not an interval starts
  promise = $interval(function() {        

    var pageType = pageType

    if (typeof $rootScope.myLat !== 'undefined' || typeof $rootScope.myLong !== 'undefined'){
    
    $http({
      method: 'GET',
      url: 'http://www.aatravel.co.za/_mobi_app/accomm.php'
    }).then(function successCallback(response) {      

      $scope.showSpiralReccom = false;

      var data = response.data;
      var reccommendedAccomArray = [];
      var reccommendedAccomDistancesArray = []; 

      var highestRating = 0;

      data.sort(function(a,b) {
        return b.pv - a.pv;
      });

      for(var x = 0; x < data.length; x++) {
        data[x]["distance"] = Math.round(getDistanceFromLatLonInKm($rootScope.myLat,$rootScope.myLong,data[x].lat,data[x].lon));
      }

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

    $interval.cancel(promise);

    }

  }, 500);

  // near me
  $scope.showSpiralNear = true;
  loadDistanceBefore("home", $rootScope, $ionicHistory, $scope, $timeout, $interval, $http, $window);

}])