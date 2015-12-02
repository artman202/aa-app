// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'angular-cache', 'ngCordova', 'ionicLazyLoad'])

.run(function($ionicPlatform, $rootScope, $ionicLoading, $cordovaGeolocation) {

  $ionicPlatform.ready(function() {

    if(ionic.Platform.isWebView() && ionic.Platform.isAndroid()){

      var osVersion = device.version;

      if(osVersion.indexOf("4.0") >= 0 || osVersion.indexOf("4.1") >= 0 || osVersion.indexOf("4.2") >= 0 || osVersion.indexOf("4.3") >= 0) {
      
      } else {
        window.plugins.nativepagetransitions.globalOptions.duration = 300;
        window.plugins.nativepagetransitions.globalOptions.iosdelay = 250;
        window.plugins.nativepagetransitions.globalOptions.androiddelay = 250;
        window.plugins.nativepagetransitions.globalOptions.winphonedelay = 250;
        window.plugins.nativepagetransitions.globalOptions.slowdownfactor = 4;
        // these are used for slide left/right only currently
        window.plugins.nativepagetransitions.globalOptions.fixedPixelsTop = 0;
        window.plugins.nativepagetransitions.globalOptions.fixedPixelsBottom = 0;
      }

    } else if (ionic.Platform.isIOS() || ionic.Platform.isIPad()) {

      window.plugins.nativepagetransitions.globalOptions.duration = 300;
      window.plugins.nativepagetransitions.globalOptions.iosdelay = 250;
      window.plugins.nativepagetransitions.globalOptions.androiddelay = 250;
      window.plugins.nativepagetransitions.globalOptions.winphonedelay = 250;
      window.plugins.nativepagetransitions.globalOptions.slowdownfactor = 4;
      // these are used for slide left/right only currently
      window.plugins.nativepagetransitions.globalOptions.fixedPixelsTop = 0;
      window.plugins.nativepagetransitions.globalOptions.fixedPixelsBottom = 0;

    } //IOS & Ipad       

    var watchOptions = {
      maximumAge : 5 * 60 * 1000,
      timeout : 30000,
      enableHighAccuracy: true // may cause errors if true
    };

    var watch = $cordovaGeolocation.watchPosition(watchOptions);
    watch.then(
      null,
      function(err) {
        alert("We regret that there is a problem retrieving your current location.")
      },
      function(position) {
        var lat  = position.coords.latitude;
        var long = position.coords.longitude;

        $rootScope.myLat = lat;
        $rootScope.myLong = long;
    });

    $rootScope.$on('loading:show', function() {
      $ionicLoading.show({template: '<ion-spinner icon="dots"></ion-spinner>'})
    })

    $rootScope.$on('loading:hide', function() {
      $ionicLoading.hide()
    })

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

  if(ionic.Platform.isWebView() && ionic.Platform.isAndroid()){

    var osVersion = device.version;

    if(osVersion.indexOf("4.0") >= 0 || osVersion.indexOf("4.1") >= 0 || osVersion.indexOf("4.2") >= 0 || osVersion.indexOf("4.3") >= 0) {
      
    } else {
      $ionicConfigProvider.views.transition('none');
    } 

  } else if (ionic.Platform.isIOS() || ionic.Platform.isIPad()) {

    $ionicConfigProvider.views.transition('none');

  } //IOS & Ipad     

  

  if(!ionic.Platform.isIOS() || ionic.Platform.isIPad())$ionicConfigProvider.scrolling.jsScrolling(false);

  $httpProvider.interceptors.push(function($rootScope) {
    return {
      request: function(config) {
        $rootScope.$broadcast('loading:show');
        return config
      },
      response: function(response) {
        $rootScope.$broadcast('loading:hide')
        return response
      }
    }
  })

  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.home', {
    cache : false,
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      }
    }
  })

  .state('app.destinations', {
    cache : false,
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
    cache : false,
    url: '/recommended',
    views: {
      'menuContent': {
        templateUrl: 'templates/recommended.html',
        controller: 'RecommendedCtrl'
      }
    }
  })

  .state('app.specials', {
    cache : false,
    url: '/specials',
    views: {
      'menuContent': {
        templateUrl: 'templates/specials.html',
        controller: 'SpecialsCtrl'
      }
    }
  })

  .state('app.near-me', {
    cache : false,
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
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.playlists', {
    url: '/playlists',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlists.html',
        controller: 'PlaylistsCtrl'
      }
    }
  })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/province.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
})

.directive('goNative', ['$ionicGesture', '$ionicPlatform', function($ionicGesture, $ionicPlatform) {

  if(ionic.Platform.isWebView() && ionic.Platform.isAndroid()){

    var osVersion = device.version;

  if(osVersion.indexOf("4.0") >= 0 || osVersion.indexOf("4.1") >= 0 || osVersion.indexOf("4.2") >= 0 || osVersion.indexOf("4.3") >= 0) {
    
  } else {

      return {
        restrict: 'A',
     
        link: function(scope, element, attrs) {
     
          $ionicGesture.on('tap', function(e) {
     
            var direction = attrs.direction;
            var transitiontype = attrs.transitiontype;
     
            $ionicPlatform.ready(function() {
     
              switch (transitiontype) {
                case "slide":
                  window.plugins.nativepagetransitions.slide({
                      "direction": direction
                    },
                    function(msg) {
                      console.log("success: " + msg)
                    },
                    function(msg) {
                      alert("error: " + msg)
                    }
                  );
                  break;
                case "flip":
                  window.plugins.nativepagetransitions.flip({
                      "direction": direction
                    },
                    function(msg) {
                      console.log("success: " + msg)
                    },
                    function(msg) {
                      alert("error: " + msg)
                    }
                  );
                  break;
                   
                case "fade":
                  window.plugins.nativepagetransitions.fade({
                       
                    },
                    function(msg) {
                      console.log("success: " + msg)
                    },
                    function(msg) {
                      alert("error: " + msg)
                    }
                  );
                  break;
     
                case "drawer":
                  window.plugins.nativepagetransitions.drawer({
                      "origin"         : direction,
                      "action"         : "open"
                    },
                    function(msg) {
                      console.log("success: " + msg)
                    },
                    function(msg) {
                      alert("error: " + msg)
                    }
                  );
                  break;
                   
                case "curl":
                  window.plugins.nativepagetransitions.curl({
                      "direction": direction
                    },
                    function(msg) {
                      console.log("success: " + msg)
                    },
                    function(msg) {
                      alert("error: " + msg)
                    }
                  );
                  break;              
                   
                default:
                  window.plugins.nativepagetransitions.slide({
                      "direction": direction
                    },
                    function(msg) {
                      console.log("success: " + msg)
                    },
                    function(msg) {
                      alert("error: " + msg)
                    }
                  );
              }
     
     
            });
          }, element);
        }
      };
      
    }   

  } else if (ionic.Platform.isIOS() || ionic.Platform.isIPad()) {

    return {
        restrict: 'A',
     
        link: function(scope, element, attrs) {
     
          $ionicGesture.on('tap', function(e) {
     
            var direction = attrs.direction;
            var transitiontype = attrs.transitiontype;
     
            $ionicPlatform.ready(function() {
     
              switch (transitiontype) {
                case "slide":
                  window.plugins.nativepagetransitions.slide({
                      "direction": direction
                    },
                    function(msg) {
                      console.log("success: " + msg)
                    },
                    function(msg) {
                      alert("error: " + msg)
                    }
                  );
                  break;
                case "flip":
                  window.plugins.nativepagetransitions.flip({
                      "direction": direction
                    },
                    function(msg) {
                      console.log("success: " + msg)
                    },
                    function(msg) {
                      alert("error: " + msg)
                    }
                  );
                  break;
                   
                case "fade":
                  window.plugins.nativepagetransitions.fade({
                       
                    },
                    function(msg) {
                      console.log("success: " + msg)
                    },
                    function(msg) {
                      alert("error: " + msg)
                    }
                  );
                  break;
     
                case "drawer":
                  window.plugins.nativepagetransitions.drawer({
                      "origin"         : direction,
                      "action"         : "open"
                    },
                    function(msg) {
                      console.log("success: " + msg)
                    },
                    function(msg) {
                      alert("error: " + msg)
                    }
                  );
                  break;
                   
                case "curl":
                  window.plugins.nativepagetransitions.curl({
                      "direction": direction
                    },
                    function(msg) {
                      console.log("success: " + msg)
                    },
                    function(msg) {
                      alert("error: " + msg)
                    }
                  );
                  break;              
                   
                default:
                  window.plugins.nativepagetransitions.slide({
                      "direction": direction
                    },
                    function(msg) {
                      console.log("success: " + msg)
                    },
                    function(msg) {
                      alert("error: " + msg)
                    }
                  );
              }
     
     
            });
          }, element);
        }
      };

  } //IOS & Ipad

  
}]);