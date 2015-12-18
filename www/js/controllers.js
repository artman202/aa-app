angular.module('starter.controllers', [])

.controller('AppCtrl', ['$scope', '$ionicModal', '$timeout', '$rootScope', '$ionicHistory', function($scope, $ionicModal, $timeout, $rootScope, $ionicHistory) {

  $rootScope.goBack = function() {
    $ionicHistory.goBack();
  }

}])

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

.controller('SearchCtrl', ['$scope', '$rootScope', '$http', 'cacheService', '$ionicLoading', '$ionicHistory', '$timeout',  function($scope, $rootScope, $http, cacheService, $ionicLoading, $ionicHistory, $timeout) {

  $scope.$on('$ionicView.enter', function() {
    $rootScope.showTabs = true;
    $rootScope.showBack = true;    
    $rootScope.enquireBtn = false;
    $rootScope.showMapBtn = false;
  });

  $scope.search = true;
  $timeout(function(){

    $ionicLoading.show({template: '<ion-spinner icon="dots"></ion-spinner>'})

    $http({
      method: 'GET',
      url: 'http://www.aatravel.co.za/_mobi_app/accomm_search.php'
    }).then(function successCallback(response) {

      $ionicLoading.hide()
      $scope.topDestinationArray = response.data

    }, function errorCallback(response) {

      navigator.notification.alert(
        'We regret that there was a problem retrieving the cities.',  // message
        null,                     // callback
        'Alert',                // title
        'Done'                  // buttonName
      );

    });

  }, $rootScope.contentTimeOut);

  $scope.searchByCity = function() {

    $scope.search = false;
    $scope.noResult = false;

    $http({
      method: 'GET',
      url: 'http://www.aatravel.co.za/_mobi_app/accomm_search.php?q='+$scope.searchQuery
    }).then(function successCallback(response) {

      var searchResults = response.data;

      // if no results are found
      if(searchResults.length == 0) {
        $scope.noResult = true;
      }

      $scope.cities = response.data;

    }, function errorCallback(response) {

      navigator.notification.alert(
        'We regret that there was a problem retrieving the top destinations.',  // message
        null,                     // callback
        'Alert',                // title
        'Done'                  // buttonName
      );

    });    
  }

  $scope.closeSearch = function() {
    $ionicHistory.goBack();
  }

}])

.controller('DestinationsCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {

  $scope.$on('$ionicView.enter', function() {
    $rootScope.showTabs = true;
    $rootScope.showBack = true;    
    $rootScope.enquireBtn = false;
    $rootScope.showMapBtn = false;
  });

  // Create province array
  var provinces = buildProvinces(); 

  // Set scope province property
  $scope.provinces = provinces;


}])

.controller('DestinationsProvinceChosenCtrl', ['$scope', '$stateParams', 'cacheService', '$rootScope', '$ionicLoading', '$timeout', function($scope, $stateParams, cacheService, $rootScope, $ionicLoading, $timeout) {

  $scope.$on('$ionicView.enter', function() {
    $rootScope.showTabs = true;
    $rootScope.showBack = true;    
    $rootScope.enquireBtn = false;
    $rootScope.showMapBtn = false;
  });
 
  var provinceId = null;

  $scope.state = $stateParams;

  $timeout(function(){

    cacheService.getDataById($ionicLoading, $stateParams.provinceId, 'http://www.aatravel.co.za/_mobi_app/accomm_search.php?province_id=').then(function (data) {

        var cities = [];

        // Filter cities according to chosen province
        for (var x = 0; x < data.length; x++) {
          if(data[x].province_id == $stateParams.provinceId) {
            cities.push(data[x]);
          } 
        }

        $scope.cities = cities;
    });

  }, $rootScope.contentTimeOut);

}])

.controller('DestinationsCityChosenCtrl', ['$scope', '$stateParams', '$http', 'cacheService', '$cordovaGeolocation', '$rootScope', '$ionicScrollDelegate', '$document', '$window', '$timeout', '$ionicHistory', '$ionicLoading', function($scope, $stateParams, $http, cacheService, $cordovaGeolocation, $rootScope, $ionicScrollDelegate, $document, $window, $timeout, $ionicHistory, $ionicLoading) {

  $scope.$on('$ionicView.enter', function() {
    $rootScope.showTabs = true;
    $rootScope.showBack = true;    
    $rootScope.enquireBtn = false;
    $rootScope.showMapBtn = true;
  });

  $scope.state = $stateParams;

  $scope.hide = true;
  $scope.showMap = false;

  $timeout(function(){

    cacheService.getDataById($ionicLoading, $stateParams.cityId, 'http://www.aatravel.co.za/_mobi_app/accomm.php?city_id=').then(function (data) {

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

        loadItemsByScroll("accommodation", $scope, $ionicScrollDelegate, $rootScope, data, $window, $timeout)

    });

  }, $rootScope.contentTimeOut);

}])

.controller('DestinationsAccomChosenCtrl', ['$scope', '$stateParams', '$http', 'cacheService', '$cordovaGeolocation', '$rootScope', '$ionicSlideBoxDelegate', '$timeout', '$cordovaSocialSharing', '$state', '$ionicHistory', '$ionicLoading', '$window', '$ionicScrollDelegate', function($scope, $stateParams, $http, cacheService, $cordovaGeolocation, $rootScope, $ionicSlideBoxDelegate, $timeout, $cordovaSocialSharing, $state, $ionicHistory, $ionicLoading, $window, $ionicScrollDelegate) {

  var enquireBtn = angular.element(document.getElementById('enquire-btn'));

  $scope.$on('$ionicView.enter', function() {
    $rootScope.showTabs = true;
    $rootScope.showBack = true;    
    $rootScope.enquireBtn = false;
    $rootScope.showMapBtn = false;

    if($ionicHistory.viewHistory().forwardView.stateName == "app.enquire-form") {
      enquireBtn.removeClass("ng-hide")
    }
    
  }); 

  $scope.$on('$ionicView.afterLeave', function() {    
    enquireBtn.addClass("ng-hide")
  });

  $scope.state = $stateParams; 

  $timeout(function(){

    cacheService.getDataById($ionicLoading, $stateParams.accomId, 'http://www.aatravel.co.za/_mobi_app/accomm_detail.php?accomm_id=').then(function (data) {

        var scrollHeight = $window.innerHeight;
        $scope.setScrollHeight = scrollHeight+"px";        

        $ionicScrollDelegate.$getByHandle('scroll-accom-chosen').resize();

        $scope.scrollFunc = function() {

          if($ionicScrollDelegate.$getByHandle('scroll-accom-chosen').getScrollPosition().top + $window.innerHeight > $ionicScrollDelegate.$getByHandle('scroll-accom-chosen').getScrollView().__contentHeight - 600) {
            enquireBtn.removeClass("ng-hide")
          };

        }

        $rootScope.goToEnquireForm = function() {
          console.log(data[0].n);
          $state.go('app.enquire-form', {accomName: data[0].n, accomId: data[0].id}); 
        }

        $scope.accommodation = data[0];

        var accomGallery = data[0].g;
        var accomGalleryArray = accomGallery.split(",");
        $scope.accomGallery = accomGalleryArray

        $scope.imgLoaded = function(id) {

          var descriptionWrap = angular.element(document.getElementById(id));
          descriptionWrap.css({"display":"none"})

        }

        // create line breaks in description
        var descriptionWrap = angular.element(document.getElementById('desc'));
        var description = data[0].de;
        $scope.desc = description.replace(/\r\n\r\n/g, '<br><br>');

        // sanitize amenities, facilities and activities
        var amenitiesData = data[0].amen;
        if(amenitiesData != null) {
          $scope.amenities = amenitiesData.split(",");
        } else {
          $scope.amenities = ["Not available"];
        }    

        var facilitiesData = data[0].fac;
        if(facilitiesData != null) {
          $scope.facilities = facilitiesData.split(",");
        } else {
          $scope.facilities = ["Not available"];
        }   

        var activitiesData = data[0].act;
        if(activitiesData != null) {
          $scope.activities = activitiesData.split(",");
        } else {
          $scope.activities = ["Not available"];
        }   

        $scope.showContent = "accommodation";

        //change content area
        $scope.changeContent = function(tabType, currentTab) {

          var tabRemove = angular.element(document.getElementsByClassName("tab-item"));
          tabRemove.removeClass("active");

          var tab = angular.element(document.getElementById(currentTab));
          tab.addClass("active");

          switch(tabType) {
            case "accommodation":
              $scope.showContent = tabType;                
              break;
            case "reviews":
              $scope.showContent = tabType;
              break;
            case "amenities":
              $scope.showContent = tabType;
              break;
            case "activities":
              $scope.showContent = tabType;
              break;
            case "near":
              $scope.showContent = tabType;
              break;
            default:
              contentWrap.html("There was an error loading the content");
          }

        } 

        // sanitize number
        var number = data[0].con;
        $scope.number = number.replace(/[^a-z0-9\s]/gi, '').substring(0, 10);

        $scope.share = function(name, type, accomId) {

          var message = name+", "+type+", http://www.aatravel.co.za/PA"+accomId;
          var link;
          var image;

          $cordovaSocialSharing
            .share(message, image, link)
            .then(function(result) {
              console.log("Social share successful")
            }, function(err) {
              console.log("Social share failed")
            })

        }

        // load map for single accommodation
        $timeout(function(){

          var latlng = new google.maps.LatLng(data[0].lat, data[0].lon);
          var myOptions = {
              zoom: 12,
              center: latlng,
              mapTypeId: google.maps.MapTypeId.ROADMAP,
          };            
          var map = new google.maps.Map(document.getElementById("single_accom_map_canvas"), myOptions);

          var image = 'img/markers/accom-marker.svg';
          var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            icon: image
          });
          $scope.map = map
          $scope.overlay = new google.maps.OverlayView();
          $scope.overlay.draw = function() {}; // empty function required
          $scope.overlay.setMap($scope.map);
          $scope.element = document.getElementById('single_accom_map_canvas');

        }, 500);

    });

  }, $rootScope.contentTimeOut);

}])

.controller('EnquireFormCtrl', ['$scope', '$rootScope', '$cordovaDatePicker', '$stateParams', '$ionicHistory', '$timeout', function($scope, $rootScope, $cordovaDatePicker, $stateParams, $ionicHistory, $timeout) {

  $scope.$on('$ionicView.enter', function() {
    $rootScope.showTabs = true;
    $rootScope.showBack = true;    
    $rootScope.enquireBtn = false;
    $rootScope.showMapBtn = false;
  });

  $timeout(function(){

    var options = {
      date: new Date(),
      mode: 'date', // or 'time'
      minDate: new Date(),
      maxDate: new Date() + 10000,
      allowOldDates: false,
      allowFutureDates: true,
      doneButtonLabel: 'DONE',
      doneButtonColor: '#F2F3F4',
      cancelButtonLabel: 'CANCEL',
      cancelButtonColor: '#000000'
    };

    $scope.runDatePickerCheckin = function($event) {
      
      $cordovaDatePicker.show(options).then(function(date){

        console.log(date);
        var dateStr = String(date);
        $scope.checkIn = dateStr.substr(0, 15);
        
      });
      $event.stopPropagation(); 
    }

    $scope.runDatePickerCheckout = function($event) {
      
      $cordovaDatePicker.show(options).then(function(date){

        console.log(date);
        var dateStr = String(date);
        $scope.checkOut = dateStr.substr(0, 15);
        
      });
      $event.stopPropagation();
    }

    $scope.submitEnquire = function(name, email, mobile, checkIn, checkOut) {

      var enquiryFormObj = {
        "mobile" : mobile,
        "accomm_id" : $stateParams.accomId,
        "checkin" : checkIn,
        "udid" : "E8AB9C2E-520A-4DFD-B024-8D1B02989B04",
        "email" : email,
        "type" : "enquire",
        "name" : name,
        "checkout" : checkOut
      }

      function enquirySubmit() {
        alert("Submitted");
        // $ionicHistory.backView();
      }

      navigator.notification.alert(
        'Your enquiry form has been sent to the establishment successfully.',  // message
        enquirySubmit,                     // callback
        'Alert',                // title
        'Done'                  // buttonName
      );      

      console.log(enquiryFormObj);
    }

  }, $rootScope.contentTimeOut);

}])

.controller('RecommendedCtrl', ['$scope', '$rootScope', '$timeout', 'cacheService', '$ionicLoading', '$ionicScrollDelegate', '$window', function($scope, $rootScope, $timeout, cacheService, $ionicLoading, $ionicScrollDelegate, $window) {
  
  $scope.$on('$ionicView.enter', function() {
    $rootScope.showTabs = true;
    $rootScope.showBack = true;    
    $rootScope.enquireBtn = false;
    $rootScope.showMapBtn = false;
  });

  $scope.hide = true;
  $scope.showMap = false;

  $timeout(function(){

    cacheService.getDataById($ionicLoading, 0, 'http://www.aatravel.co.za/_mobi_app/accomm.php').then(function (data) {

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

      loadItemsByScroll("recommended", $scope, $ionicScrollDelegate, $rootScope, data, $window, $timeout)

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

.controller('NearMeCtrl', ['$scope', '$rootScope', '$http', '$interval', '$ionicLoading', '$timeout', '$window', '$ionicHistory', function($scope, $rootScope, $http, $interval, $ionicLoading, $timeout, $window, $ionicHistory) {
  
  $scope.$on('$ionicView.enter', function() {
    $rootScope.showTabs = true;
    $rootScope.showBack = true;    
    $rootScope.enquireBtn = false;
    $rootScope.showMapBtn = true;
  });

  $scope.showSpiralNear = true;     

  $timeout(function(){

    loadDistanceBefore("near-me", $rootScope, $ionicHistory, $scope, $timeout, $interval, $http, $window);        

  }, 500);

}])

.service('cacheService', function ($q, $http, CacheFactory, $stateParams) {

  CacheFactory('dataCache', {
    maxAge: 15 * 60 * 500, // Items added to this cache expire after 15 week
    cacheFlushInterval: 15 * 60 * 500, // This cache will clear itself 15 week
    deleteOnExpire: 'aggressive' // Items will be deleted from this cache when they expire
  });

  return {
    getDataById: function ($ionicLoading, id, apiUrl) {

      $ionicLoading.show({template: '<ion-spinner icon="dots"></ion-spinner>'})

      var jsonId = id

      if(id == 0) {

        jsonId = "";
        25
      }

      var deferred = $q.defer();
      var start = new Date().getTime();
      var dataCache = CacheFactory.get('dataCache');

      // Now that control of inserting/removing from the cache is in our hands,
      // we can interact with the data in "dataCache" outside of this context,
      // e.g. Modify the data after it has been returned from the server and
      // save those modifications to the cache.
      if (dataCache.get(id)) {

        $ionicLoading.hide()

        deferred.resolve(dataCache.get(id));
      } else {

        $http({
          method: 'GET',
          url: apiUrl+''+jsonId
        }).then(function successCallback(response) {  

        $ionicLoading.hide()        

          var data = response.data;

          dataCache.put(id, data);
          deferred.resolve(data);

        }, function errorCallback(response) {

          navigator.notification.alert(
            'We regret that there is a problem retrieving the cities.',  // message
            null,                     // callback
            'Alert',                // title
            'Done'                  // buttonName
          );

        });

      }
      return deferred.promise;
    }
  };
})

function loadDistanceBefore(pageType, $rootScope, $ionicHistory, $scope, $timeout, $interval, $http, $window) {

  var promise;

    // test if the location has been updated yet, if not an interval starts
  promise = $interval(function() {        

    var pageType = pageType

    if (typeof $rootScope.myLat !== 'undefined' || typeof $rootScope.myLong !== 'undefined'){

      // if(pageType == "near-me") {

      // } else if(pageType == "home") {      
      //   $rootScope.$broadcast('loading:hide');
      // }

      $http({
        method: 'GET',
        url: 'http://www.aatravel.co.za/_mobi_app/accomm.php?gps=1&latitude='+$rootScope.myLat+'&longitude='+$rootScope.myLong
      }).then(function successCallback(response) {

        $scope.showSpiralNear = false;

        $scope.aaRating = calculateRating(response.data);        

        var accommodations = response.data;

        $rootScope.controllerMapView = function() {

          $ionicHistory.clearCache();
          $scope.showMap = true;

          $timeout(function(){
            mapView(accommodations, $rootScope, "nearme-map", $ionicHistory);
          }, 500);

        }

        $rootScope.controllerListView = function() {

          $scope.showMap = false;

          $rootScope.$broadcast('loading:show');

          $timeout(function(){
            $rootScope.$broadcast('loading:hide');
          }, 500);

        }        

        var distanceArray = []; 

        for ( var x = 0; x < accommodations.length; x++) {
          accommodations[x]["distance"] = Math.round(getDistanceFromLatLonInKm($rootScope.myLat,$rootScope.myLong,accommodations[x].lat,accommodations[x].lon));
          // distanceArray.push(Math.round(getDistanceFromLatLonInKm($rootScope.myLat,$rootScope.myLong,accommodations[x].lat,accommodations[x].lon)));
        }

        // $scope.accommodationsDistances = distanceArray;

        accommodations.sort(function(a,b) {
          return a.distance - b.distance;
        });

        $scope.accommodations = accommodations;

        // the interval breaks if location is loaded
        $interval.cancel();

        var scrollHeight = $window.innerHeight;
        $scope.setScrollHeight = scrollHeight+"px";

      }, function errorCallback(response) {

        navigator.notification.alert(
          'We regret that there is a problem retrieving the accommodations near you',  // message
          null,                     // callback
          'Alert',                // title
          'Done'                  // buttonName
        );

      });

      $interval.cancel(promise);

    }

  }, 500);

}

function buildProvinces() {
  return [
    { id: 1, link: 'eastern-cape', name: 'Eastern Cape', image: 'img/provinces/eastern-cape.svg' },
    { id: 2, link: 'free-state', name: 'Free State', image: 'img/provinces/freestate.svg' },
    { id: 3, link: 'gauteng', name: 'Gauteng', image: 'img/provinces/gauteng.svg' },
    { id: 4, link: 'kwazulu-natal', name: 'KwaZulu Natal', image: 'img/provinces/kwazulu-natal.svg'  },    
    { id: 5, link: 'mpumalanga', name: 'Mpumalanga', image: 'img/provinces/mpumalanga.svg'  },
    { id: 6, link: 'northern-cape', name: 'Northern Cape', image: 'img/provinces/northern-cape.svg'  },    
    { id: 8, link: 'north-west', name: 'North West', image: 'img/provinces/north-west.svg'  },
    { id: 9, link: 'western-cape', name: 'Western Cape', image: 'img/provinces/western-cape.svg'  },
    { id: 11, link: 'limpopo', name: 'Limpopo', image: 'img/provinces/limpopo.svg'  }
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

function mapView(data, $rootScope, mapType) {  

  // show loader
  $rootScope.$broadcast('loading:show');

  setTimeout(function(){
    $rootScope.$broadcast('loading:hide');
  }, 1000);

  var Latlng = "";

  if(mapType == 'accommodation-map') {

    // run normal add marker script    
    var Latlng = new google.maps.LatLng(data[0].lat, data[0].lon);
    var mapOptions = {
      zoom: 11,
      center: Latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    };

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

  } else if(mapType == 'nearme-map') {

    var Latlng = new google.maps.LatLng($rootScope.myLat, $rootScope.myLong);

    var mapOptions = {
      zoom: 11,
      center: Latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    };

    // add your location with unique marker
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    var myLocImage = 'img/markers/accom-marker-location.svg';
    var marker = new google.maps.Marker({
      position: Latlng,
      map: map,
      icon: myLocImage,
      title: "You are here!"
    });
    marker.addListener('click', markerMyLocation);

  }  

  var markersArray = [];
  var image = 'img/markers/accom-marker.svg';
  for(var x = 0; x < data.length; x++) {
    
    var LatLng = new google.maps.LatLng(data[x].lat,data[x].lon);
    var marker = new google.maps.Marker({
      position: LatLng,
      map: map,
      id: data[x].id,
      title: data[x].n,
      icon: image
    });
    marker.addListener('click', markerId);

    markersArray.push(marker);

  }

  var infowindow = new google.maps.InfoWindow();

  function markerMyLocation() {
    infowindow.close()
    infowindow.setContent(this.title);
    infowindow.open(map, this);
  }

  function markerId() {

    if (infowindow) {
        infowindow.close();
    }

    var markerObj = {};

    for(var x = 0; x < data.length; x++) {

      if(this.id == data[x].id) {
        markerObj = data[x];
        marker = markersArray[x]
      }

    }

    infowindow.close()
    infowindow.setContent(markerObj.n);
    infowindow.open(map, marker);

    var markerLink = angular.element(document.getElementById('map-list-item-wrap'));

    markerLink.html("\
      <div class='padding map-list-item-wrap' id='"+markerObj.tb+"'>\
        <a type='button' class='map-item-close-btn' onclick='closeMapListItem()'>\
          <i class='icon ion-close'></i>\
        </a>\
        <a type='button' id='map-list-box' class='map-list-item padding' href='#/app/destinations/{{state.provinceName}}+id={{state.provinceId}}/{{state.cityName}}+id={{state.cityId}}/"+markerObj.n+"+id="+markerObj.id+"' class='accom-btn'>\
          <div class='row'>\
            <div class='col accom-img-bg'>\
              <div class='accom-distance bg-yellow white'>\
                "+Math.round(getDistanceFromLatLonInKm($rootScope.myLat,$rootScope.myLong,markerObj.lat,markerObj.lon))+" km\
              </div>\
              <img src='"+markerObj.tb+"'>\
            </div>\
            <div class='col col-75 accom-content'>\
              <h3 class='page-blue-heading'>\
                <b>\
                  "+markerObj.n+"\
                </b>\
              </h3>\
              <div class='accom-title-underline'></div>\
              <div class='row accom-ratings-row'>\
                <div class='col col-50'>\
                  <img src='img/ratings/ratings-"+markerObj.r+".svg'>\
                </div>\
                <div class='col col-50 accom-ratings-row-price' ng-if='"+markerObj.pl+" != 0.00'>\
                  <b>"+markerObj.pl+" ZAR</b>\
                </div>\
              </div>\
              <div class='row'>\
              </div>\
            </div>\
          </div>\
        </a>\
      </div>\
    ")

  }

}

function closeMapListItem() {

  var markerLink = angular.element(document.getElementById('map-list-item-wrap'));
  markerLink.html("");

}

function calculateRating(data) {

  var data = data;
  var ratingArray = [];

  // create the final multi dimensional array
  for ( var x = 0; x < data.length; x++) {

    switch(data[x].ar){
      case '1':
        ratingArray.push({"text":"AA Recommended", "rating":"img/aaqa/1.png"});
        break;
      case '2':
        ratingArray.push({"text":"AA Highly Recommended", "rating":"img/aaqa/2.png"});
        break;
      case '3':
        ratingArray.push({"text":"AA Superior", "rating":"img/aaqa/3.png"});
        break;
      case '4':
        ratingArray.push({"text":"AA Recommended/Highly Recommended", "rating":"img/aaqa/2.png"});
        break;
      case '5':
        ratingArray.push({"text":"AA Highly Recommended/Superior", "rating":"img/aaqa/3.png"});
        break;
      case '6':
        ratingArray.push({"text":"AA Eco", "rating":"img/aaqa/4.png"});
        break;
      case '7':
        ratingArray.push({"text":"AA Quality Assured", "rating":"img/aaqa/9.png"});
        break;
      case '8':
        ratingArray.push({"text":"AA Quality Assured", "rating":"img/aaqa/9.png"});
        break;
      case '9':
        ratingArray.push({"text":"Status Pending", "rating":"img/aaqa/9.png"});
        break;
      default:
        ratingArray.push({"text":"", "rating":""});
        break;
    }         

  }

  return ratingArray;
}

function imgError(image) {
  image.onerror = "";
  image.src = "img/ionic.png";
  return true;
}

function loadItemsByScroll(pageType, $scope, $ionicScrollDelegate, $rootScope, data, $window, $timeout) {

  if(pageType == "recommended") {
    data.sort(function(a,b) {
      return b.pv - a.pv;
    });
  }

  var distanceArray = [];
  
  var data = data;

  // the number of items loaded (15)
  var loadNumItems = 20;
  var accommodationsArray = [];
  var loadAccomNum = Math.ceil(data.length / loadNumItems);

  // create grouped number array
  for ( var x = 0; x < loadAccomNum; x++) {
    accommodationsArray.push(loadNumItems)
    loadNumItems += 20;
  }

  var itemsArrayWrap = [];
  var itemArray = [];

  // the grouped array counter
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

  $scope.aaRating = calculateRating(data);

  // console.log(ratingArray);

  $scope.itemsArray = itemsArrayWrap[0]; 
  
  var container = angular.element(document.getElementById('container'));

  // var scrollHeight = $window.innerHeight;
  var scrollHeight = $window.innerHeight;
  $scope.setScrollHeight = scrollHeight+"px";

  var arrayUpdateStart = 1;
  // $scope.show = 1;

  $ionicScrollDelegate.$getByHandle('scroll').resize();

  // create scroll load function
  $scope.scrollFunc = function() {

    if($ionicScrollDelegate.$getByHandle('scroll').getScrollPosition().top + $window.innerHeight == $ionicScrollDelegate.$getByHandle('scroll').getScrollView().__contentHeight + 10) {

      var p = arrayUpdateStart;
      var n = 0;

      if(loadAccomNum == p) {
        $scope.hide = true;
        $scope.end = true;
        $scope.$apply();
      } else {
        $scope.hide = false;
        $scope.$apply();
      }            

      $timeout(function(){             

        for(var x = 0; x < itemsArrayWrap[p].length; x++) {

          itemsArrayWrap[0].push(itemsArrayWrap[p][x]);
          n = p;

        }              

        $timeout(function(){

          arrayUpdateStart++;
          $scope.show = 0;

        }, 500);
       
        scrollHeight = $window.innerHeight;
        $scope.hide = true;
        $scope.$apply();

        $ionicScrollDelegate.$getByHandle('scroll').resize();

      }, 500);

    }
  }

  $scope.accommodationsDistances = distanceArray;

}