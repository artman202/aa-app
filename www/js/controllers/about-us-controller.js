angular.module('about.us.controller', [])

.controller('AboutUsCtrl', ['$scope', '$rootScope', '$cordovaDatePicker', '$stateParams', '$ionicHistory', '$timeout', '$http', function($scope, $rootScope, $cordovaDatePicker, $stateParams, $ionicHistory, $timeout, $http) {

  $scope.$on('$ionicView.enter', function() {
    $rootScope.showTabs = true;
    $rootScope.showBack = false;    
    $rootScope.enquireBtn = false;
  });

}])