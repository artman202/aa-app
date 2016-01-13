angular.module('favourite.accommodations.controller', [])

.controller('FavouriteAccommodationsCtrl', ['$scope', '$rootScope', '$ionicHistory', '$interval', '$http', '$window', '$timeout', '$cordovaFile', function($scope, $rootScope, $ionicHistory, $interval, $http, $window, $timeout, $cordovaFile) {

  $scope.$on('$ionicView.enter', function() {

    $rootScope.showTabs = true;
    $rootScope.showBack = false;
    $rootScope.enquireBtn = false;

    $scope.noResults = false;
    $cordovaFile.readAsText(cordova.file.dataDirectory, "favourites.txt")
      .then(function (success) {
        console.log(success);
        var favAccommArray = success.split(",")        

        $scope.accommodations = favAccommArray;

        console.log(favAccommArray)
        // $scope.acommodations = favAccommArray;
      }, function (error) {

        $scope.noResults = true;

        console.log(error)
      });

    $scope.deleteShow = false;
    $scope.selected = "";

  });

  $timeout(function(){
    
    $scope.deleteFavourites = function() {
      if($scope.deleteShow) {
        $scope.deleteShow = false;
        $scope.selected = "";
      } else {
        $scope.deleteShow = true;
        $scope.selected = "yellow-activated";
      }  
    }

    $scope.deleteFavouriteItem = function(favItem) {

      navigator.notification.confirm(
        'Are you sure you would like to delete this favourite?',  // message
        deleteChoice,                     // callback
        'Alert',   
        'Yes,Cancel'                 // buttonName
      );

      function deleteChoice(buttonIndex) {

        if(buttonIndex == 1) {

          $cordovaFile.readAsText(cordova.file.dataDirectory, "favourites.txt")
            .then(function (success) {

              var favAccommArray = success.split(",")

              if(favAccommArray.length == 1) {

                $cordovaFile.removeFile(cordova.file.dataDirectory, "favourites.txt")
                  .then(function (success) {
                    $scope.accommodations = [];
                    $scope.noResults = true;
                  }, function (error) {
                    console.log(error)
                  });

              } else {

                if(favAccommArray.indexOf(favItem) == 0) {
                  favAccommArray.shift();
                  var newScopeArray = favAccommArray;
                  var updatedArray = favAccommArray.join();
                  console.log(updatedArray)
                  $cordovaFile.writeFile(cordova.file.dataDirectory, "favourites.txt", updatedArray, true)
                    .then(function (success) {
                      
                      $scope.accommodations = newScopeArray

                    }, function (error) {
                      console.log(error)
                    });
                } else {
                  favAccommArray.splice(favAccommArray.indexOf(favItem), favAccommArray.indexOf(favItem));
                  var newScopeArray = favAccommArray;
                  var updatedArray = favAccommArray.join();
                  console.log(updatedArray)
                  $cordovaFile.writeFile(cordova.file.dataDirectory, "favourites.txt", updatedArray, true)
                    .then(function (success) {
                      
                      $scope.accommodations = newScopeArray

                    }, function (error) {
                      console.log(error)
                    });
                }
                
              }   
              
            }, function (error) {
              console.log(error)
            });

        } else if (buttonIndex == 2) {

        }

      }

    }
    
  }, $rootScope.contentTimeOut);

}])