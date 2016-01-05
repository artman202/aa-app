angular.module('near.me.controller', [])

.controller('NearMeCtrl', ['$scope', '$rootScope', '$http', '$interval', '$ionicLoading', '$timeout', '$window', '$ionicHistory', function($scope, $rootScope, $http, $interval, $ionicLoading, $timeout, $window, $ionicHistory) {
  
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

  $scope.showSpiralNear = true;     

  $timeout(function(){

    loadDistanceBefore("near-me", $rootScope, $ionicHistory, $scope, $timeout, $interval, $http, $window);        

  }, 500);

}])