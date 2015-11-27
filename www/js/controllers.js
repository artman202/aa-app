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

.controller('DestinationsProvinceChosenCtrl', ['$scope', '$stateParams', '$http', function($scope, $stateParams, $http) {
 
  var provinceId = null;

  $scope.state = $stateParams;

  // Get cities
  $http({
    method: 'GET',
    url: 'http://www.proportal.co.za/_mobi_app/accomm_search.php?province_id='+$stateParams.provinceId
  }).then(function successCallback(response) {

    var data = response.data;

    var cities = [];

    // Filter cities according to chosen province
    for (var x = 0; x < data.length; x++) {
      if(data[x].province_id == $stateParams.provinceId) {
        cities.push(data[x]);
      } 
    }

    $scope.cities = cities;

  }, function errorCallback(response) {
    alert("We regret that there is a problem retrieving the cities.")
  });

}])

.controller('DestinationsCityChosenCtrl', ['$scope', '$stateParams', '$http', function($scope, $stateParams, $http) {

  $scope.state = $stateParams;

  $http({
    method: 'GET',
    url: 'http://www.proportal.co.za/_mobi_app/accomm.php?city_id='+$stateParams.cityId
  }).then(function successCallback(response) {

    $scope.accommodations = response.data;

  }, function errorCallback(response) {

    alert("We regret that there is a problem retrieving the accommodations.")

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