angular.module('destinations.city.chosen.controller', [])

.controller('DestinationsCityChosenCtrl', ['$scope', '$stateParams', '$http', '$cordovaGeolocation', '$rootScope', '$ionicScrollDelegate', '$document', '$window', '$timeout', '$ionicHistory', '$ionicLoading', '$ionicModal', function($scope, $stateParams, $http, $cordovaGeolocation, $rootScope, $ionicScrollDelegate, $document, $window, $timeout, $ionicHistory, $ionicLoading, $ionicModal) {

  $scope.$on('$ionicView.beforeEnter', function() {
    hideMap($ionicHistory, $rootScope);
  });

  $scope.$on('$ionicView.enter', function() {
    $rootScope.showTabs = true;
    $rootScope.showBack = true;    
    $rootScope.enquireBtn = false;
    $rootScope.showMapBtn = true;

    if($rootScope.showMap == true) {
      $timeout(function(){
        var mapBtn = angular.element(document.getElementsByClassName('map-view-btn'));
        mapBtn.addClass('yellow-activated');
      }, 100);      
    } else {
      $timeout(function(){
        var listBtn = angular.element(document.getElementsByClassName('list-view-btn'));
        listBtn.addClass('yellow-activated');
      }, 100);
    }

  });

  $scope.state = $stateParams;

  $scope.hide = true;
  $scope.showMap = false;

  $timeout(function(){    

    $ionicLoading.show({template: '<ion-spinner icon="dots"></ion-spinner>'})

    $http({
      method: 'GET',
      url: 'http://www.aatravel.co.za/_mobi_app/accomm.php?city_id='+$stateParams.cityId
    }).then(function successCallback(response) {  

      $ionicLoading.hide()        

      var data = response.data;

      $scope.filterBy = "Alphabetically";
      $scope.openModal = function() {
        showModal($ionicModal, $scope, $rootScope);        
      };
      $scope.filterData = function(filterType, mySelect) {
        filter(filterType, mySelect, $scope, $rootScope);
      }
      $scope.closeModal = function() {
        runFilter($scope, data, $rootScope)
        loadItemsByScroll("accommodation", $scope, $ionicScrollDelegate, $rootScope, $scope.filteredData, $window, $timeout)
        $scope.modal.hide();
      };

      $rootScope.controllerMapView = function() {

        var listBtn = angular.element(document.getElementsByClassName('list-view-btn'));
        listBtn.removeClass('yellow-activated');

        var mapBtn = angular.element(document.getElementsByClassName('map-view-btn'));
        mapBtn.addClass('yellow-activated');

        $ionicHistory.clearCache();
        $rootScope.showMap = true;

        $timeout(function(){
          mapView(data, $rootScope, "accommodation-map", $ionicHistory);
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

      $scope.results = data.length;

      loadItemsByScroll("accommodation", $scope, $ionicScrollDelegate, $rootScope, data, $window, $timeout)

    }, function errorCallback(response) {

      navigator.notification.alert(
        'We regret that there is a problem retrieving the cities.',  // message
        null,                     // callback
        'Alert',                // title
        'Done'                  // buttonName
      );

    });

  }, $rootScope.contentTimeOut);

}])