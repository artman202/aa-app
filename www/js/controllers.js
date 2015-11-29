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

}])

.controller('DestinationsCityChosenCtrl', ['$scope', '$stateParams', '$http', 'cacheService', '$cordovaGeolocation', function($scope, $stateParams, $http, cacheService, $cordovaGeolocation) {

  $scope.state = $stateParams;

  cacheService.getDataById($stateParams.cityId, 'http://www.proportal.co.za/_mobi_app/accomm.php?city_id=').then(function (data) {

      $scope.accommodations = data;

      var destinationsArray = [];

      for(var x = 0; x < data.length; x++) {

        var origin = new google.maps.LatLng(-25.877066, 28.158993);
        var destination = new google.maps.LatLng(data[x].lat, data[x].lon);

        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
          {
            origins: [origin],
            destinations: [destination],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false,
          }, callback(data[x].id));

        function callback(e){
          return function (response, status) {

            if (status == google.maps.DistanceMatrixStatus.OK) {

              var origins = response.originAddresses;
              var destinations = response.destinationAddresses;

              var distances = [];

              for (var i = 0; i < origins.length; i++) {

                var results = response.rows[i].elements;
                for (var j = 0; j < results.length; j++) {

                  var element = results[j];
                  var distance = element.distance.text;

                  document.getElementById(e).innerHTML = distance;

                  console.log(e);

                  // if (e != "") {
                  //   document.getElementById(e).innerHTML = distance;
                  // } else {
                  //   document.getElementById(e).innerHTML = 'NA';
                  // }                  

                }
              }
            }          
          }
        }
      }

      

      // console.log(destinationsArray);

      // var origin = new google.maps.LatLng(-25.877066, 28.158993);

      // var service = new google.maps.DistanceMatrixService();
      // service.getDistanceMatrix(
      //   {
      //     origins: [origin],
      //     destinations: destinationsArray,
      //     travelMode: google.maps.TravelMode.DRIVING,
      //     unitSystem: google.maps.UnitSystem.METRIC,
      //     avoidHighways: false,
      //     avoidTolls: false,
      //   }, callback);

      // function callback(response, status) {
      //   $scope.r = response;
      // }

      // var posOptions = {timeout: 20000, enableHighAccuracy: true};
      // $cordovaGeolocation
      //   .getCurrentPosition(posOptions)
      //   .then(function (position) {

      //     var lat  = position.coords.latitude
      //     var long = position.coords.longitude          

      //     // https://maps.googleapis.com/maps/api/distancematrix/json?origins=-25.877066,28.158993&destinations=-25.98667,30.43556

      //     alert(lat +'+'+ long)

      //   }, function(err) {

      //     alert("We regret that there is a problem retrieving your current location.")

      //   });

    return cacheService.getDataById($stateParams.cityId, 'http://www.proportal.co.za/_mobi_app/accomm.php?city_id=').then(function (data) {
      // e.g. "time taken for request: 1ms"
    });
  });

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
    maxAge: 10080 * 60 * 1000, // Items added to this cache expire after 1 week
    cacheFlushInterval: 10080 * 60 * 1000, // This cache will clear itself 1 week
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