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

.controller('HomeCtrl', ['$scope', '$rootScope', '$ionicHistory', '$timeout', '$interval', '$http', '$window', '$ionicLoading', function($scope, $rootScope, $ionicHistory, $timeout, $interval, $http, $window, $ionicLoading) {

  $scope.$on('$ionicView.enter', function() {
    $rootScope.showTabs = false;
    $rootScope.showBack = false;
    $rootScope.enquireBtn = false;
    $rootScope.showMapBtn = false;
  });

  $scope.item = "img/homepage-banner/homepage-banner-1.png"

  setTimeout(function(){

    $scope.showSpiral = true;
    findAccomNearMe("home", $rootScope, $ionicHistory, $scope, $timeout, $interval, $http, $window);

  }, $rootScope.contentTimeOut);

}])

.controller('SearchCtrl', ['$scope', '$rootScope', '$http', 'cacheService', '$ionicLoading', '$ionicHistory',  function($scope, $rootScope, $http, cacheService, $ionicLoading, $ionicHistory) {

  $scope.$on('$ionicView.enter', function() {
    $rootScope.showTabs = true;
    $rootScope.showBack = true;    
    $rootScope.enquireBtn = false;
    $rootScope.showMapBtn = false;
  });  

  $scope.search = true;

  setTimeout(function(){

    cacheService.getDataById($ionicLoading, 0, 'http://www.aatravel.co.za/_mobi_app/accomm_search.php').then(function (data) {

      // e.g. "time taken for request: 2375ms"
      // Data returned by this next call is already cached.

      $scope.topDestinationArray = data

      return cacheService.getDataById($ionicLoading, 0, 'http://www.aatravel.co.za/_mobi_app/accomm_search.php').then(function (data) {
        // e.g. "time taken for request: 1ms"
      });
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
        'We regret that there is no results for this query.',  // message
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

.controller('DestinationsProvinceChosenCtrl', ['$scope', '$stateParams', 'cacheService', '$rootScope', '$ionicLoading', function($scope, $stateParams, cacheService, $rootScope, $ionicLoading) {

  $scope.$on('$ionicView.enter', function() {
    $rootScope.showTabs = true;
    $rootScope.showBack = true;    
    $rootScope.enquireBtn = false;
    $rootScope.showMapBtn = false;
  });
 
  var provinceId = null;

  $scope.state = $stateParams;

  setTimeout(function(){

    cacheService.getDataById($ionicLoading, $stateParams.provinceId, 'http://www.aatravel.co.za/_mobi_app/accomm_search.php?province_id=').then(function (data) {
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

      return cacheService.getDataById($ionicLoading, $stateParams.provinceId, 'http://www.aatravel.co.za/_mobi_app/accomm_search.php?province_id=').then(function (data) {
        // e.g. "time taken for request: 1ms"
      });
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

  setTimeout(function(){

    cacheService.getDataById($ionicLoading, $stateParams.cityId, 'http://www.aatravel.co.za/_mobi_app/accomm.php?city_id=').then(function (data) {

        $rootScope.controllerMapView = function() {

          $ionicHistory.clearCache();
          $scope.showMap = true;

          $timeout(function(){
            mapView(data, $rootScope, "accommodation-map", $ionicHistory);
          }, 100);

        }

        $rootScope.controllerListView = function() {

          $scope.showMap = false;

          $rootScope.$broadcast('loading:show');

          setTimeout(function(){
            $rootScope.$broadcast('loading:hide');
          }, 500);

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

        var ratingArray = [];

        // switch($rating){
        //   case '1' : $txt='AA Recommended'; $img='img/aaqa/1.png'; break;
        //   case '2' : $txt='AA Highly Recommended'; $img='img/aaqa/2.png'; break;
        //   case '3' : $txt='AA Superior'; $img='img/aaqa/3.png'; break;
        //   case '4' : $txt='AA Recommended/Highly Recommended'; $img='img/aaqa/2.png'; break;
        //   case '5' : $txt='AA Highly Recommended/Superior'; $img='img/aaqa/3.png'; break;
        //   case '6' : $txt='AA Eco'; $img='img/aaqa/4.png'; break;

        //   case '7' : $txt='AA Quality Assured'; $img='img/aaqa/9.png'; break;
        //   case '8' : $txt='AA Quality Assured'; $img='img/aaqa/9.png'; break;
        //   case '9' : $txt='Status Pending'; $img='img/aaqa/9.png'; break;
        //   default : $txt=''; $img=''; break;
        // }

        // create the final multi dimensional array
        for ( var x = 0; x < data.length; x++) {

          distanceArray.push(Math.round(getDistanceFromLatLonInKm($rootScope.myLat,$rootScope.myLong,data[x].lat,data[x].lon)));
          
          itemArray.push(data[x]);

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

          if (x == accommodationsArray[n] || x == data.length -1) {
            itemsArrayWrap.push(itemArray);
            itemArray = [];
            n++
          }           

        }

        $scope.aaRating = ratingArray;

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

              $ionicScrollDelegate.$getByHandle('scroll').resize();

            }, 500);

          }
        }

        $scope.accommodationsDistances = distanceArray;        

      return cacheService.getDataById($ionicLoading, $stateParams.cityId, 'http://www.aatravel.co.za/_mobi_app/accomm.php?city_id=').then(function (data) {
        // e.g. "time taken for request: 1ms"
      });
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

  setTimeout(function(){

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

        $scope.accomGallery = accomGalleryArray;

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

      return cacheService.getDataById($ionicLoading, $stateParams.accomId, 'http://www.aatravel.co.za/_mobi_app/accomm_detail.php?accomm_id=').then(function (data) {
        // e.g. "time taken for request: 1ms"
      });
    });

  }, $rootScope.contentTimeOut);

}])

.controller('EnquireFormCtrl', ['$scope', '$rootScope', '$cordovaDatePicker', '$stateParams', '$ionicHistory', function($scope, $rootScope, $cordovaDatePicker, $stateParams, $ionicHistory) {

  $scope.$on('$ionicView.enter', function() {
    $rootScope.showTabs = true;
    $rootScope.showBack = true;    
    $rootScope.enquireBtn = false;
    $rootScope.showMapBtn = false;
  });

  setTimeout(function(){

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

.controller('RecommendedCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
  
  $scope.$on('$ionicView.enter', function() {
    $rootScope.showTabs = true;
    $rootScope.showBack = true;    
    $rootScope.enquireBtn = false;
    $rootScope.showMapBtn = false;
  });

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

  $scope.showSpiral = true;     

  setTimeout(function(){

    findAccomNearMe("near-me", $rootScope, $ionicHistory, $scope, $timeout, $interval, $http, $window);        

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

function findAccomNearMe(pageType, $rootScope, $ionicHistory, $scope, $timeout, $interval, $http, $window) {

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

        $scope.showSpiral = false;

        var accommodations = response.data;

        $rootScope.controllerMapView = function() {

          $ionicHistory.clearCache();
          $scope.showMap = true;

          $timeout(function(){
            mapView(accommodations, $rootScope, "nearme-map", $ionicHistory);
          }, 100);

        }

        $rootScope.controllerListView = function() {

          $scope.showMap = false;

          $rootScope.$broadcast('loading:show');

          setTimeout(function(){
            $rootScope.$broadcast('loading:hide');
          }, 500);

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