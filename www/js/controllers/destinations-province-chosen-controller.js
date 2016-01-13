angular.module('destinations.province.chosen.controller', [])

.controller('DestinationsProvinceChosenCtrl', ['$scope', '$stateParams', '$rootScope', '$ionicLoading', '$timeout', '$http', function($scope, $stateParams, $rootScope, $ionicLoading, $timeout, $http) {

  $scope.$on('$ionicView.enter', function() {
    $rootScope.showTabs = true;
    $rootScope.showBack = true;    
    $rootScope.enquireBtn = false;
    
  });
 
  var provinceId = null;

  $scope.state = $stateParams;

  $timeout(function(){

    $ionicLoading.show({template: $rootScope.ionSpinnerTemplate})

    $http({
      method: 'GET',
      url: 'http://www.aatravel.co.za/_mobi_app/accomm_search.php?province_id='+$stateParams.provinceId
    }).then(function successCallback(response) {  

    $ionicLoading.hide()        

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

      navigator.notification.alert(
        'We regret that there is a problem retrieving the cities.',  // message
        null,                     // callback
        'Alert',                // title
        'Done'                  // buttonName
      );

    });

  }, $rootScope.contentTimeOut);

}])