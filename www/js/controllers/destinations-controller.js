angular.module('destinations.controller', [])

.controller('DestinationsCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {

  $scope.$on('$ionicView.beforeEnter', function() {
    $rootScope.showTabs = true;
    $rootScope.showBack = true;    
    $rootScope.enquireBtn = false;
  });

  // Create province array
  var provinces = buildProvinces(); 

  // Set scope province property
  $scope.provinces = provinces;


}])