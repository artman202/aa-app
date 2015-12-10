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
    }, 500);
  };
}])

.controller('HomeCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {

  $rootScope.showTabs = false;
  $rootScope.showBack = false;

}])

.controller('SearchCtrl', ['$scope', '$rootScope', '$http', 'cacheService',  function($scope, $rootScope, $http, cacheService, $cordovaNetwork) {
  
  $rootScope.showTabs = true;
  $rootScope.showBack = true;

  $scope.search = true;

  setTimeout(function(){

    cacheService.getDataById(0, 'http://www.proportal.co.za/_mobi_app/accomm_search.php').then(function (data) {
      // e.g. "time taken for request: 2375ms"
      // Data returned by this next call is already cached.

      $scope.topDestinationArray = data

      return cacheService.getDataById(0, 'http://www.proportal.co.za/_mobi_app/accomm_search.php').then(function (data) {
        // e.g. "time taken for request: 1ms"
      });
    });

  }, 500);

  $scope.searchByCity = function() {

    $scope.search = false;
    $scope.noResult = false;

    $http({
      method: 'GET',
      url: 'http://www.proportal.co.za/_mobi_app/accomm_search.php?q='+$scope.searchQuery
    }).then(function successCallback(response) {

      var searchResults = response.data;

      // if no results are found
      if(searchResults.length == 0) {
        $scope.noResult = true;
      }

      $scope.cities = response.data;

    }, function errorCallback(response) {

      navigator.notification.alert(
        'We regret that there is no results for this query.',  // message
        '',                     // callback
        'Alert',                // title
        'Done'                  // buttonName
      );

    });    
  }



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

  }, 500);

}])

.controller('DestinationsCityChosenCtrl', ['$scope', '$stateParams', '$http', 'cacheService', '$cordovaGeolocation', '$rootScope', '$ionicScrollDelegate', '$document', '$window', '$timeout', function($scope, $stateParams, $http, cacheService, $cordovaGeolocation, $rootScope, $ionicScrollDelegate, $document, $window, $timeout) {

  $scope.state = $stateParams;

  $scope.hide = true;

  $scope.showMap = false;

  setTimeout(function(){

    cacheService.getDataById($stateParams.cityId, 'http://www.proportal.co.za/_mobi_app/accomm.php?city_id=').then(function (data) {

        $rootScope.controllerMapView = function() {

          $scope.showMap = true;

          $timeout(function(){
            mapView(data, $rootScope, "accommodation-map");
          }, 100);

        }

        $rootScope.controllerListView = function() {

          $scope.showMap = false;

        }

        var distanceArray = [];

        // the number of results
        $scope.results = data.length;

        // the number of items loaded (15)
        var loadNumItems = 15;
        var accommodationsArray = [];
        var loadAccomNum = Math.ceil(data.length / loadNumItems);

        // create grouped number array
        for ( var x = 0; x < loadAccomNum; x++) {
          accommodationsArray.push(loadNumItems)
          loadNumItems += 15;
        }

        var itemsArrayWrap = [];
        var itemArray = [];

        // the grouped array counter
        n = 0;

        // create the final multi dimensional array
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
        
        var container = angular.element(document.getElementById('container'));

        // var scrollHeight = $window.innerHeight;
        var scrollHeight = $window.innerHeight;
        $scope.setScrollHeight = scrollHeight+"px";

        var arrayUpdateStart = 1;
        // $scope.show = 1;

        // create scroll load function
        $scope.scrollFunc = function() {          

          if($ionicScrollDelegate.$getByHandle('scroll').getScrollPosition().top + $window.innerHeight == $ionicScrollDelegate.$getByHandle('scroll').getScrollView().__contentHeight) {

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

            setTimeout(function(){             

              for(var x = 0; x < itemsArrayWrap[p].length; x++) {

                itemsArrayWrap[0].push(itemsArrayWrap[p][x]);
                n = p;

              }              

              setTimeout(function(){

                arrayUpdateStart++;
                $scope.show = 0;

              }, 500);
             
              scrollHeight = $window.innerHeight;
              $scope.hide = true;
              $scope.$apply();

            }, 500);

          }
        }

        $scope.accommodationsDistances = distanceArray;        

      return cacheService.getDataById($stateParams.cityId, 'http://www.proportal.co.za/_mobi_app/accomm.php?city_id=').then(function (data) {
        // e.g. "time taken for request: 1ms"
      });
    });

  }, 500);

}])

.controller('DestinationsAccomChosenCtrl', ['$scope', '$stateParams', '$http', 'cacheService', '$cordovaGeolocation', '$rootScope', '$ionicSlideBoxDelegate', '$timeout', '$cordovaSocialSharing', function($scope, $stateParams, $http, cacheService, $cordovaGeolocation, $rootScope, $ionicSlideBoxDelegate, $timeout, $cordovaSocialSharing) {

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

        $scope.share = function(message) {

          $cordovaSocialSharing
            .share(message) // Share via native share sheet
            .then(function(result) {
              // Success!
            }, function(err) {
              // An error occured. Show a message to the user
            });

        }

        // load map for single accommodation
        $timeout(function(){

            $scope.$apply();

            var latlng = new google.maps.LatLng(data[0].lat, data[0].lon);
            var myOptions = {
                zoom: 12,
                center: latlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
            };            
            var map = new google.maps.Map(document.getElementById("single_accom_map_canvas"), myOptions);
            var marker = new google.maps.Marker({
              position: latlng,
              map: map,
              title: 'Hello World!'
            });
            $scope.map = map
            $scope.overlay = new google.maps.OverlayView();
            $scope.overlay.draw = function() {}; // empty function required
            $scope.overlay.setMap($scope.map);
            $scope.element = document.getElementById('single_accom_map_canvas');
            // $scope.hammertime = Hammer($scope.element).on("hold", function(event) {
            //     $scope.addOnClick(event);
            // });

        }, 100);


        // for(var x = 0; x < accomGallery.legth)

      return cacheService.getDataById($stateParams.accomId, 'http://www.proportal.co.za/_mobi_app/accomm_detail.php?accomm_id=').then(function (data) {
        // e.g. "time taken for request: 1ms"
      });
    });

  }, 500);

}])

.controller('RecommendedCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
  
  $rootScope.showTabs = true;
  $rootScope.showBack = true;

}])

.controller('SpecialsCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
  
  $rootScope.showTabs = true;
  $rootScope.showBack = true;

}])

.controller('NearMeCtrl', ['$scope', '$rootScope', '$http', '$interval', '$ionicLoading', '$timeout', '$window', function($scope, $rootScope, $http, $interval, $ionicLoading, $timeout, $window) {
  
  $rootScope.showTabs = true;
  $rootScope.showBack = true;

  $scope.showSpiral = true;

  $scope.showMap = false;   

  setTimeout(function(){

    var promise;

    // test if the location has been updated yet, if not an interval starts
    promise = $interval(function() {

      console.log("Reloading locations near me")

      if (typeof $rootScope.myLat !== 'undefined' || typeof $rootScope.myLong !== 'undefined'){

        $http({
          method: 'GET',
          url: 'http://www.proportal.co.za/_mobi_app/accomm.php?gps=1&latitude='+$rootScope.myLat+'&longitude='+$rootScope.myLong
        }).then(function successCallback(response) {

          $scope.showSpiral = false;

          var accommodations = response.data;

          $rootScope.controllerMapView = function() {

          $scope.showMap = true;

            $timeout(function(){
              mapView(accommodations, $rootScope, "nearme-map");
            }, 100);

          }

          $rootScope.controllerListView = function() {

            $scope.showMap = false;

          }

          $scope.accommodations = accommodations;
          var distanceArray = []; 

          for ( var x = 0; x < accommodations.length; x++) {
            distanceArray.push(Math.round(getDistanceFromLatLonInKm($rootScope.myLat,$rootScope.myLong,accommodations[x].lat,accommodations[x].lon)));
          }

          $scope.accommodationsDistances = distanceArray;

          // the interval breaks if location is loaded
          $interval.cancel();

          var scrollHeight = $window.innerHeight;
          $scope.setScrollHeight = scrollHeight+"px";

        }, function errorCallback(response) {

          navigator.notification.alert(
            'We regret that there is a problem retrieving the cities.',  // message
            '',                     // callback
            'Alert',                // title
            'Done'                  // buttonName
          );

        });

        $interval.cancel(promise);

      }

    }, 500);    

  }, 500);

}])

.service('cacheService', function ($q, $http, CacheFactory, $stateParams) {

  CacheFactory('dataCache', {
    maxAge: 15 * 60 * 500, // Items added to this cache expire after 15 week
    cacheFlushInterval: 15 * 60 * 500, // This cache will clear itself 15 week
    deleteOnExpire: 'aggressive' // Items will be deleted from this cache when they expire
  });

  return {
    getDataById: function (id, apiUrl) {

      var jsonId = id

      if(id == 0) {
        jsonId = "";
      }

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
          url: apiUrl+''+jsonId
        }).then(function successCallback(response) {

          var data = response.data;

          dataCache.put(id, data);
          deferred.resolve(data);

        }, function errorCallback(response) {

          navigator.notification.alert(
            'We regret that there is a problem retrieving the cities.',  // message
            '',                     // callback
            'Alert',                // title
            'Done'                  // buttonName
          );

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

function mapView(data, $rootScope, mapType) {

  if(mapType == 'accommodation-map') {

    var Latlng = new google.maps.LatLng(data[0].lat, data[0].lon);

  } else if(mapType == 'nearme-map') {

    var Latlng = new google.maps.LatLng($rootScope.myLat, $rootScope.myLong);

  }

  
  var mapOptions = {
    zoom: 11,
    center: Latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: true
  };
  var map = new google.maps.Map(document.getElementById("map"), mapOptions);

  var markersArray = [];
  for(var x = 0; x < data.length; x++) {
    
    var LatLng = new google.maps.LatLng(data[x].lat,data[x].lon);
    var marker = new google.maps.Marker({
      position: LatLng,
      map: map,
      id: data[x].id,
      title: data[x].n,
    });
    marker.addListener('click', markerId);

    markersArray.push(marker);

  }

  var infowindow = new google.maps.InfoWindow();

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
              <img src='http://www.proportal.co.za/"+markerObj.tb+"'>\
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