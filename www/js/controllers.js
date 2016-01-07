angular.module('starter.controllers', [])

.controller('AppCtrl', ['$scope', '$ionicModal', '$timeout', '$rootScope', '$ionicHistory', function($scope, $ionicModal, $timeout, $rootScope, $ionicHistory) {

  $rootScope.goBack = function() {
    $ionicHistory.goBack();
  }

}])

// FUNCTIONS --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

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
        $scope.resultsLoaded = true;

        $scope.aaRating = calculateRating(response.data);        

        var accommodations = response.data;

        $rootScope.controllerMapView = function() {

          var listBtn = angular.element(document.getElementsByClassName('list-view-btn'));
          listBtn.removeClass('yellow-activated');

          var mapBtn = angular.element(document.getElementsByClassName('map-view-btn'));
          mapBtn.addClass('yellow-activated');

          $ionicHistory.clearCache();
          $rootScope.showMap = true;

          $timeout(function(){
            mapView(accommodations, $rootScope, "accommodation-map", $ionicHistory);
          }, 500);

        }

        $rootScope.controllerListView = function() {

          var listBtn = angular.element(document.getElementsByClassName('list-view-btn'));
          listBtn.addClass('yellow-activated');

          var mapBtn = angular.element(document.getElementsByClassName('map-view-btn'));
          mapBtn.removeClass('yellow-activated');

          $rootScope.showMap = false;

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
        $scope.nearMeAccommodations = accommodations;

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
              <div class='accom-distance bg-yellow white' ng-if='$root.positionAvailable'>\
                <i class='icon ion-location'></i>&nbsp;"+Math.round(getDistanceFromLatLonInKm($rootScope.myLat,$rootScope.myLong,markerObj.lat,markerObj.lon))+" km\
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

// function loadItemsByScroll(pageType, $scope, $ionicScrollDelegate, $rootScope, data, $window, $timeout) {

//   if(pageType == "recommended") {
//     data.sort(function(a,b) {
//       return b.pv - a.pv;
//     });
//   }

//   var distanceArray = [];
  
//   var data = data;

//   // the number of items loaded (15)
//   var loadNumItems = 20;
//   var accommodationsArray = [];
//   var loadAccomNum = Math.ceil(data.length / loadNumItems);

//   // create grouped number array
//   for ( var x = 0; x < loadAccomNum; x++) {
//     accommodationsArray.push(loadNumItems)
//     loadNumItems += 20;
//   }

//   var itemsArrayWrap = [];
//   var itemArray = [];

//   // the grouped array counter
//   n = 0;

//   for ( var x = 0; x < data.length; x++) {

//     distanceArray.push(Math.round(getDistanceFromLatLonInKm($rootScope.myLat,$rootScope.myLong,data[x].lat,data[x].lon)));

//     itemArray.push(data[x]);

//     if (x == accommodationsArray[n] || x == data.length -1) {
//       itemsArrayWrap.push(itemArray);
//       itemArray = [];
//       n++
//     }  

//   }

//   $scope.aaRating = calculateRating(data);

//   // console.log(ratingArray);

//   $scope.itemsArray = itemsArrayWrap[0]; 
  
//   var container = angular.element(document.getElementById('container'));

//   // var scrollHeight = $window.innerHeight;
//   var scrollHeight = $window.innerHeight;
//   $scope.setScrollHeight = scrollHeight+"px";

//   var arrayUpdateStart = 1;
//   // $scope.show = 1;

//   $ionicScrollDelegate.$getByHandle('scroll').resize();

//   // create scroll load function
//   $scope.scrollFunc = function() {

//     if($ionicScrollDelegate.$getByHandle('scroll').getScrollPosition().top + $window.innerHeight == $ionicScrollDelegate.$getByHandle('scroll').getScrollView().__contentHeight + 10) {

//       var p = arrayUpdateStart;
//       var n = 0;

//       if(loadAccomNum == p) {
//         $scope.hide = true;
//         $scope.end = true;
//         $scope.$apply();
//       } else {
//         $scope.hide = false;
//         $scope.$apply();
//       }            

//       $timeout(function(){             

//         for(var x = 0; x < itemsArrayWrap[p].length; x++) {

//           itemsArrayWrap[0].push(itemsArrayWrap[p][x]);
//           n = p;

//         }              

//         $timeout(function(){

//           arrayUpdateStart++;
//           $scope.show = 0;

//         }, 500);
       
//         scrollHeight = $window.innerHeight;
//         $scope.hide = true;
//         $scope.$apply();

//         $ionicScrollDelegate.$getByHandle('scroll').resize();

//       }, 500);

//     }
//   }

//   $scope.accommodationsDistances = distanceArray;

// }

function hideMap($ionicHistory, $rootScope) {

  var viewKeys = $ionicHistory.viewHistory().views;
  var viewArray = [];
  for (var key in viewKeys) {
    viewArray.push(viewKeys[key]);
  }
  var previousView = viewArray.slice(-1)[0].stateName;
  if (previousView != 'app.destinations-accom-chosen') {
    $rootScope.showMap = false;
  }

}

function showModal($ionicModal, $scope, $rootScope, page) {  

  $ionicModal.fromTemplateUrl('templates/filter-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
    $scope.modal.show();
  });

  if(typeof $scope.mySelect === 'undefined') {
    $rootScope.mySelect = '0';
  }

  if(page == 'alphabetical') {
    $scope.alphabetical = true;
    $scope.radioValue = page;
    $scope.select = "";
  } else if(page == 'distance') {
    $scope.distance = true;
    $scope.radioValue = page;
    $scope.select = "";
  }

}

function filter(filterType, mySelect, $scope, $rootScope) {

  $scope.radioValue = filterType;

  switch(filterType) {
    case 'alphabetical':
      $scope.alphabetical = true;
      $scope.priceHigh = false;
      $scope.priceLow = false;
      $scope.distance = false;
      $rootScope.mySelect = '0';
      $scope.featureSelected = true
      break;
    case 'price-high':
      $scope.alphabetical = false;
      $scope.priceHigh = true;
      $scope.priceLow = false;
      $scope.distance = false;
      $rootScope.mySelect = '0';
      $scope.featureSelected = true
      break;
    case 'price-low':
      $scope.alphabetical = false;
      $scope.priceHigh = false;
      $scope.priceLow = true;
      $scope.distance = false;
      $rootScope.mySelect = '0';
      $scope.featureSelected = true
      break;
    case 'distance':
      $scope.alphabetical = false;
      $scope.priceHigh = false;
      $scope.priceLow = false;
      $scope.distance = true;
      $rootScope.mySelect = '0';
      $scope.featureSelected = true
      break;
    case 'aaqa':
      $scope.alphabetical = false;
      $scope.priceHigh = false;
      $scope.priceLow = false;
      $scope.distance = false;
      $scope.featureSelected = true
      break;
  }

  if(filterType != 'aaqa') {

    $rootScope.mySelect = '0';    

    var allRadios = angular.element(document.getElementsByClassName("radio-icon"));
    allRadios.css({"display":"inline-block"})

  } else {

    var allRadios = angular.element(document.getElementsByClassName("radio-icon"));
    allRadios.css({"display":"none"})
    
  }

}

function runFilter($scope, data, $rootScope, $ionicScrollDelegate) {

  $ionicScrollDelegate.scrollTop();

  filterType = $scope.radioValue
  mySelect = $rootScope.mySelect

  // sort price array
  var hasPriceArray = [];
  var missingPriceArray = [];
  var distanceArray = [];
  for(var x = 0; x < data.length; x++) {
    if (data[x].pl != "0.00") {
      hasPriceArray.push(data[x])
    } else {
      missingPriceArray.push(data[x])
    }
  };

  switch(filterType) {
    case 'alphabetical':
      data.sort(function(a,b) {
        if(a.n < b.n) return -1;
        if(a.n > b.n) return 1;
        return 0;
      });
      for(var x = 0; x < data.length; x++) {
        console.log(data[x].n)
      }
      $scope.filterBy = "Alphabetical";
      $scope.filteredData = data;

      // reload distances & ratings according to filter      
      reloadDistance($scope, $scope.filteredData, $rootScope); 

      break;    
    case 'price-high':
      hasPriceArray.sort(function(a,b) {
        return b.pl - a.pl;
      });
      $scope.filterBy = "Price (High to Low)";
      $scope.filteredData = hasPriceArray.concat(missingPriceArray);

      // reload distances & ratings according to filter      
      reloadDistance($scope, $scope.filteredData, $rootScope); 

      break;
    case 'price-low':
      hasPriceArray.sort(function(a,b) {
        return a.pl - b.pl;
      });
      $scope.filterBy = "Price (Low to High)";
      $scope.filteredData = hasPriceArray.concat(missingPriceArray);

      // reload distances & ratings according to filter      
      reloadDistance($scope, $scope.filteredData, $rootScope);

      break;
    case 'distance':
      for(var x = 0; x < data.length; x++) {
        data[x]['distance'] = Math.round(getDistanceFromLatLonInKm($rootScope.myLat, $rootScope.myLong, data[x].lat, data[x].lon));
        distanceArray.push(data[x])
      }
      distanceArray.sort(function(a,b) {
        return a.distance - b.distance;
      });
      $scope.filterBy = "Distance";
      $scope.filteredData = distanceArray;

      // reload distances & ratings according to filter      
      reloadDistance($scope, $scope.filteredData, $rootScope);

      break;
    case 'aaqa':
      selectRecom(mySelect, data, $scope, $rootScope);
      break;
    default:
      $scope.filteredData = data;
      break;
  }
}

function reloadDistance($scope, filteredData, $rootScope) {
  var distanceArray = [];
  for ( var x = 0; x < filteredData.length; x++) {
    distanceArray.push(Math.round(getDistanceFromLatLonInKm($rootScope.myLat,$rootScope.myLong,filteredData[x].lat,filteredData[x].lon)));
  }
  $scope.aaRatingArray = calculateRating(filteredData);
  $scope.distanceArray = distanceArray;
}

function selectRecom(mySelect, data, $scope, $rootScope) {
  var recommendedArray = [];      
  switch(mySelect) {
    case '1':
      for(var x = 0; x < data.length; x++) {
        if(data[x].ar == '1')
        recommendedArray.push(data[x]);
      }
      $scope.filteredData = recommendedArray;
      $scope.mySelect = '1';

      // reload distances & ratings according to filter      
      reloadDistance($scope, $scope.filteredData, $rootScope);
      $scope.filterBy = "AA Recommended";
      break;
    case '2':
      for(var x = 0; x < data.length; x++) {
        if(data[x].ar == '2')
        recommendedArray.push(data[x]);
      }
      $scope.filteredData = recommendedArray;
      $scope.mySelect = '2';

      // reload distances & ratings according to filter      
      reloadDistance($scope, $scope.filteredData, $rootScope);
      $scope.filterBy = "AA Highly Recommended";
      break;
    case '3':
      for(var x = 0; x < data.length; x++) {
        if(data[x].ar == '3')
        recommendedArray.push(data[x]);
      }
      $scope.filteredData = recommendedArray;
      $scope.mySelect = '3';

      // reload distances & ratings according to filter      
      reloadDistance($scope, $scope.filteredData, $rootScope);
      $scope.filterBy = "AA Superior";
      break;
    case '4':
      for(var x = 0; x < data.length; x++) {
        if(data[x].ar == '4')
        recommendedArray.push(data[x]);
      }
      $scope.filteredData = recommendedArray;
      $scope.mySelect = '4';

      // reload distances & ratings according to filter      
      reloadDistance($scope, $scope.filteredData, $rootScope);
      $scope.filterBy = "AA Recommended/Highly Recommended";
      break;
    case '5':
      for(var x = 0; x < data.length; x++) {
        if(data[x].ar == '5')
        recommendedArray.push(data[x]);
      }
      $scope.filteredData = recommendedArray;
      $scope.mySelect = '5';
      $scope.filterBy = "Distance";
      // reload distances & ratings according to filter      
      reloadDistance($scope, $scope.filteredData, $rootScope);

      break;
    case '6':
      for(var x = 0; x < data.length; x++) {
        if(data[x].ar == '6')
        recommendedArray.push(data[x]);
      }
      $scope.filteredData = recommendedArray;
      $scope.mySelect = '6';
      $scope.filterBy = "AA Eco";
      // reload distances & ratings according to filter      
      reloadDistance($scope, $scope.filteredData, $rootScope);

      break;
    case '7':
      for(var x = 0; x < data.length; x++) {
        if(data[x].ar == '7' || data[x].ar == '8')
        recommendedArray.push(data[x]);
      }
      $scope.filteredData = recommendedArray;
      $scope.mySelect = '7';
      $scope.filterBy = "AA Quality Assured";
      // reload distances & ratings according to filter      
      reloadDistance($scope, $scope.filteredData, $rootScope);

      break;
    case '8':
      for(var x = 0; x < data.length; x++) {
        if(data[x].ar == '9')
        recommendedArray.push(data[x]);
      }
      $scope.filteredData = recommendedArray;
      $scope.mySelect = '8';
      $scope.filterBy = "Status Pending";
      // reload distances & ratings according to filter      
      reloadDistance($scope, $scope.filteredData, $rootScope);

      break;
    default:
      $scope.filteredData = data;
      break;
  }
}