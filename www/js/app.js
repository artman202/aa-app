// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngMessages', 'starter.controllers', 'home.controller', 'destinations.controller', 'search.controller', 'destinations.province.chosen.controller', 'destinations.city.chosen.controller', 'destinations.accom.chosen.controller', 'enquiry.form.controller', 'recommended.controller', 'near.me.controller', 'angular-cache', 'ngCordova', 'ngOnload'])

.run(function($ionicPlatform, $rootScope, $ionicLoading, $cordovaGeolocation, $cordovaNetwork, $interval, $ionicHistory, $ionicSideMenuDelegate) {

  $ionicPlatform.ready(function() {

    // disable content drag opens menu on ios
    if(ionic.Platform.isIOS() || ionic.Platform.isIPad()) {
      $ionicSideMenuDelegate.canDragContent(false);
    }

    // set content load time out
    $rootScope.contentTimeOut = 500;

    // Check for network connection
    if(window.Connection) {
      if(navigator.connection.type == Connection.NONE) {
        navigator.notification.alert(
          'There is no internet connection. Please re enable the internet connection in order for the app to function properly.',  // message
          null,                     // callback
          'Alert',                // title
          'Done'                  // buttonName
        );
      }
    }

    // Check for network connection
    function checkConnection() {
        var networkState = navigator.connection.type;

        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.CELL]     = 'Cell generic connection';
        states[Connection.NONE]     = 'No network connection';

        // console.log('Connection type: ' + states[networkState]);
    }

    $interval(function(){
      checkConnection();
    }, 5000)

    document.addEventListener("offline", onOffline, false);

    function onOffline() {

      navigator.notification.alert(
        'There is no internet connection. Please re enable the internet connection in order for the app to function properly.',  // message
        null,                     // callback
        'Alert',                // title
        'Done'                  // buttonName
      );

    }

    var promise
    var watchOptions = {
      maximumAge : 1 * 60 * 1000,
      timeout : 30000,
      enableHighAccuracy: true // may cause errors if true
    };

    var watch = $cordovaGeolocation.watchPosition(watchOptions);
    watch.then(
      null,
      function(err) {

        if(ionic.Platform.isIOS() || ionic.Platform.isIPad()) {

          var posOptions = {timeout: 10000, enableHighAccuracy: false};

          promise = $interval(function() { 
            $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {

              // alert("Get current position retrieved");

              var lat  = position.coords.latitude
              var long = position.coords.longitude

              $rootScope.myLat = lat;
              $rootScope.myLong = long;

            }, function(err) {

              navigator.notification.alert(

                'We regret that there is a problem retrieving your current location. This app does not require your location but turning it on allows for a better browsing experience.',  // message
                null,                    // callback
                'Alert',                // title
                'Done'                  // buttonName
              );

            });
          }, 5 * 60 * 1000);

        } else {

          navigator.notification.alert(
            'We regret that there is a problem retrieving your current location. This app does not require your location but turning it on allows for a better browsing experience.',  // message
            null,                     // callback
            'Alert',                // title
            'Done'                  // buttonName
          );

        }        
        
      },
      function(position) {

        $interval.cancel(promise);

        // alert("Watch position retrieved")

        var lat  = position.coords.latitude;
        var long = position.coords.longitude;

        $rootScope.myLat = lat;
        $rootScope.myLong = long;
    });

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

  });
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider) {  

  if(!ionic.Platform.isIOS() || ionic.Platform.isIPad())$ionicConfigProvider.scrolling.jsScrolling(false);

  $stateProvider
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })

    .state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html',
          controller: 'HomeCtrl'
        }
      }
    })

    .state('app.destinations', {
      url: '/destinations',
      views: {
        'menuContent': {
          templateUrl: 'templates/destinations.html',
          controller: 'DestinationsCtrl'
        }
      }
    })

    .state('app.destinations-province-chosen', {
      url: '/destinations/:provinceName+id=:provinceId',
      data: {'context':'login'},
      views: {
        'menuContent': {
          templateUrl: 'templates/destinations-province-chosen.html',
          controller: 'DestinationsProvinceChosenCtrl'
        }
      }
    })

    .state('app.destinations-city-chosen', {
      url: '/destinations/:provinceName+id=:provinceId/:cityName+id=:cityId',
      views: {
        'menuContent': {
          templateUrl: 'templates/destinations-city-chosen.html',
          controller: 'DestinationsCityChosenCtrl'
        }
      }
    })

    .state('app.destinations-accom-chosen', {
      url: '/destinations/:provinceName+id=:provinceId/:cityName+id=:cityId/:accomName+id=:accomId',
      views: {
        'menuContent': {
          templateUrl: 'templates/destinations-accom-chosen.html',
          controller: 'DestinationsAccomChosenCtrl'
        }
      }
    })

    .state('app.recommended', {
      url: '/recommended',
      views: {
        'menuContent': {
          templateUrl: 'templates/recommended.html',
          controller: 'RecommendedCtrl'
        }
      }
    })

    .state('app.specials', {
      url: '/specials',
      views: {
        'menuContent': {
          templateUrl: 'templates/specials.html',
          controller: 'SpecialsCtrl'
        }
      }
    })

    .state('app.near-me', {
      url: '/near-me',
      views: {
        'menuContent': {
          templateUrl: 'templates/near-me.html',
          controller: 'NearMeCtrl'
        }
      }
    })

    .state('app.search', {
      url: '/search',
      views: {
        'menuContent': {
          templateUrl: 'templates/search.html',
          controller: 'SearchCtrl'
        }
      }
    })

    .state('app.enquire-form', {
      url: '/destinations/enquire-form/:accomName+id=:accomId',
      views: {
        'menuContent': {
          templateUrl: 'templates/enquire-form.html',
          controller: 'EnquireFormCtrl'
        }
      }
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
})

.directive('imageonload', function() {
  return {
      restrict: 'A',
      link: function(scope, element, attrs) {
          element.bind('load', function() {

            var children = element.parent();
            children.find("div").css({"display":"none"});
            
          });
      }
  };
})