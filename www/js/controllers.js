angular.module('starter.controllers', [])

.controller('AppCtrl', ['$scope', '$ionicModal', '$timeout', '$rootScope', '$ionicHistory', function($scope, $ionicModal, $timeout, $rootScope, $ionicHistory) {

  $rootScope.goBack = function() {
    $ionicHistory.goBack();
  }

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
}])

.controller('HomeCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {

  $rootScope.showTabs = false;
  $rootScope.showBack = false;

}])

.controller('DestinationsCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
  
  $rootScope.showTabs = true;
  $rootScope.showBack = true;

  // Create province array
  var provinces = buildProvinces(); 

  // Set scope province property
  $scope.provinces = provinces;


}])

.controller('DestinationsProvinceChosenCtrl', ['$scope', '$stateParams', 'cacheService', function($scope, $stateParams, cacheService) {
 
  var provinceId = null;

  $scope.state = $stateParams;

  setTimeout(function(){

    cacheService.getDataById($stateParams.provinceId, 'http://www.proportal.co.za/_mobi_app/accomm_search.php?province_id=').then(function (data) {
      // e.g. "time taken for request: 2375ms"
      // Data returned by this next call is already cached.

        var cities = [];

        // Filter cities according to chosen province
        for (var x = 0; x < data.length; x++) {
          if(data[x].province_id == $stateParams.provinceId) {
            cities.push(data[x]);
          } 
        }

        $scope.cities = cities;

      return cacheService.getDataById($stateParams.provinceId, 'http://www.proportal.co.za/_mobi_app/accomm_search.php?province_id=').then(function (data) {
        // e.g. "time taken for request: 1ms"
      });
    });

  }, 1000);

}])

.controller('DestinationsCityChosenCtrl', ['$scope', '$stateParams', '$http', 'cacheService', '$cordovaGeolocation', '$rootScope', '$ionicScrollDelegate', '$document', '$window', '$q', function($scope, $stateParams, $http, cacheService, $cordovaGeolocation, $rootScope, $ionicScrollDelegate, $document, $window, $q) {

  $scope.state = $stateParams;

  setTimeout(function(){

    cacheService.getDataById($stateParams.cityId, 'http://www.proportal.co.za/_mobi_app/accomm.php?city_id=').then(function (data) {

        var distanceArray = [];       

        var loadNumItems = 10;
        var accommodationsArray = [];
        var loadAccomNum = Math.ceil(data.length / loadNumItems);

        console.log(loadAccomNum);

        // var p = 10;
        for ( var x = 0; x < loadAccomNum; x++) {
          accommodationsArray.push(loadNumItems)
          loadNumItems += 10;
        }

        // console.log(accommodationsArray); 

        var itemsArrayWrap = [];
        var itemArray = [];

        n = 0;
        for ( var x = 0; x < data.length; x++) {

          distanceArray.push(Math.round(getDistanceFromLatLonInKm($rootScope.myLat,$rootScope.myLong,data[x].lat,data[x].lon)));
          itemArray.push(data[x]);

          if (x == accommodationsArray[n] || x == data.length -1) {
            itemsArrayWrap.push(itemArray);
            itemArray = [];
            n++
          }           

        }

        $scope.itemsArray = itemsArrayWrap[0]; 

        console.log(itemsArrayWrap[0]);   
        
        var container = angular.element(document.getElementById('container'));

        // var scrollHeight = $window.innerHeight;
        var scrollHeight = $window.innerHeight;
        console.log(scrollHeight);
        $scope.setScrollHeight = scrollHeight+"px";        

        // var scrollTrigger = 600;


        var arrayUpdateStart = 1;


        $scope.scrollFunc = function() {

              if($ionicScrollDelegate.$getByHandle('scroll').getScrollPosition().top + $window.innerHeight == $ionicScrollDelegate.$getByHandle('scroll').getScrollView().__contentHeight) {

                var p = arrayUpdateStart;
                var n = 0;

                for(var x = 0; x < itemsArrayWrap[p].length; x++) {
                  itemsArrayWrap[0].push(itemsArrayWrap[p][x]);
                  n = p;
                }

                setTimeout(function(){

                  arrayUpdateStart++;

                }, 500);
                 
                scrollHeight = $window.innerHeight;
                $scope.$apply();

              }

        }



        // $scope.accommodations = data;
        // $scope.accommodationsDistances = distanceArray;        

      return cacheService.getDataById($stateParams.cityId, 'http://www.proportal.co.za/_mobi_app/accomm.php?city_id=').then(function (data) {
        // e.g. "time taken for request: 1ms"
      });
    });

  }, 1000);

}])

.controller('DestinationsAccomChosenCtrl', ['$scope', '$stateParams', '$http', 'cacheService', '$cordovaGeolocation', '$rootScope', '$ionicSlideBoxDelegate', function($scope, $stateParams, $http, cacheService, $cordovaGeolocation, $rootScope, $ionicSlideBoxDelegate) {

  $scope.state = $stateParams;

  setTimeout(function(){

    cacheService.getDataById($stateParams.accomId, 'http://www.proportal.co.za/_mobi_app/accomm_detail.php?accomm_id=').then(function (data) {

        $scope.accommodation = data[0];

        var accomGallery = data[0].g;
        var accomGalleryArray = accomGallery.split(",");

        $scope.accomGallery = accomGalleryArray;
        $ionicSlideBoxDelegate.$getByHandle('image-viewer').update();

        $scope.slideChanged = function(index) {


          var galleryLength = accomGalleryArray.length;

          if(index == galleryLength-1) {

            setTimeout(function(){
              $ionicSlideBoxDelegate.slide(0);
            },4000);

          }

        };

        // for(var x = 0; x < accomGallery.legth)

      return cacheService.getDataById($stateParams.accomId, 'http://www.proportal.co.za/_mobi_app/accomm_detail.php?accomm_id=').then(function (data) {
        // e.g. "time taken for request: 1ms"
      });
    });

  }, 1000);

}])

.controller('RecommendedCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
  
  $rootScope.showTabs = true;
  $rootScope.showBack = true;

}])

.controller('SpecialsCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
  
  $rootScope.showTabs = true;
  $rootScope.showBack = true;

}])

.controller('NearMeCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
  
  $rootScope.showTabs = true;
  $rootScope.showBack = true;

}])

.service('cacheService', function ($q, $http, CacheFactory, $stateParams) {

  CacheFactory('dataCache', {
    maxAge: 15 * 60 * 1000, // Items added to this cache expire after 15 week
    cacheFlushInterval: 15 * 60 * 1000, // This cache will clear itself 15 week
    deleteOnExpire: 'aggressive' // Items will be deleted from this cache when they expire
  });

  return {
    getDataById: function (id, apiUrl) {
      var deferred = $q.defer();
      var start = new Date().getTime();
      var dataCache = CacheFactory.get('dataCache');

      // Now that control of inserting/removing from the cache is in our hands,
      // we can interact with the data in "dataCache" outside of this context,
      // e.g. Modify the data after it has been returned from the server and
      // save those modifications to the cache.
      if (dataCache.get(id)) {
        deferred.resolve(dataCache.get(id));
      } else {

        $http({
          method: 'GET',
          url: apiUrl+''+id
        }).then(function successCallback(response) {

          var data = response.data;

          dataCache.put(id, data);
          deferred.resolve(data);

        }, function errorCallback(response) {

          alert("We regret that there is a problem retrieving the cities.");

        });

      }
      return deferred.promise;
    }
  };
})

function buildProvinces() {
  return [
    { id: 1, link: 'eastern-cape', name: 'Eastern Cape' },
    { id: 2, link: 'free-state', name: 'Free State' },
    { id: 3, link: 'gauteng', name: 'Gauteng' },
    { id: 4, link: 'kwazulu-natal', name: 'KwaZulu Natal' },    
    { id: 5, link: 'mpumalanga', name: 'Mpumalanga' },
    { id: 6, link: 'northern-cape', name: 'Northern Cape' },    
    { id: 8, link: 'north-west', name: 'North West' },
    { id: 9, link: 'western-cape', name: 'Western Cape' },
    { id: 11, link: 'limpopo', name: 'Limpopo' }
  ];
}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}