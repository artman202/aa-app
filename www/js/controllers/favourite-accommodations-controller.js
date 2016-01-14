angular.module('favourite.accommodations.controller', [])

.controller('FavouriteAccommodationsCtrl', ['$scope', '$rootScope', '$ionicHistory', '$interval', '$http', '$window', '$timeout', '$cordovaFile', '$ionicLoading', function($scope, $rootScope, $ionicHistory, $interval, $http, $window, $timeout, $cordovaFile, $ionicLoading) {

  $scope.$on('$ionicView.enter', function() {
    $rootScope.showTabs = true;
    $rootScope.showBack = false;
    $rootScope.enquireBtn = false;

    $scope.noResults = false;
    $cordovaFile.readAsText(cordova.file.dataDirectory, "favourites.txt")
      .then(function (success) {

        $ionicLoading.show({template: $rootScope.ionSpinnerTemplate})

        $http({
          method: 'GET',
          url: 'http://www.aatravel.co.za/_mobi_app/accomm.php?ids='+success
        }).then(function successCallback(response) {

          $ionicLoading.hide();
          var data = response.data;

          $scope.accommodations = data;
          var distanceArray = [];
          for ( var x = 0; x < data.length; x++) {
            distanceArray.push(Math.round(getDistanceFromLatLonInKm($rootScope.myLat,$rootScope.myLong,data[x].lat,data[x].lon)));
          }
          $scope.accommodationsDistances = distanceArray;
          $scope.aaRating = calculateRating(data);

        }, function errorCallback(response) {
          console.log(response);
        });
        // var favAccommArray = success.split(",")        

        // $scope.accommodations = favAccommArray;

        // console.log(favAccommArray)
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

      console.log(favItem)
      var currentAccommArray = $scope.accommodations;
      console.log(currentAccommArray);

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

              var favAccommArray = success.split(",");

              if(favAccommArray.length == 1) {

                $cordovaFile.removeFile(cordova.file.dataDirectory, "favourites.txt")
                  .then(function (success) {
                    $scope.accommodations = [];
                    $scope.noResults = true;
                  }, function (error) {
                    console.log(error)
                  });

              } else {
                
                var newScopeArray = [];
                var updatedScopeArray = [];
                for (var x = 0; x < favAccommArray.length; x++ ) {
                  if(currentAccommArray[x].id != favItem) {
                    updatedScopeArray.push(currentAccommArray[x])
                    newScopeArray.push(currentAccommArray[x].id)
                  }
                }              
                var updatedArray = newScopeArray.join();
                $cordovaFile.writeFile(cordova.file.dataDirectory, "favourites.txt", updatedArray, true)
                  .then(function (success) {
                    
                    $scope.accommodations = updatedScopeArray;


                  }, function (error) {
                    console.log(error)
                  });

              }

            }, function (error) {
              console.log(error)
            });


          // $cordovaFile.readAsText(cordova.file.dataDirectory, "favourites.txt")
          //   .then(function (success) {

          //     var favAccommArray = success.split(",");

          //     console.log("String: "+success)
          //     console.log(favAccommArray.length)           

          //     if(favAccommArray.length == 1) {

          //       $cordovaFile.removeFile(cordova.file.dataDirectory, "favourites.txt")
          //         .then(function (success) {
          //           $scope.accommodations = [];
          //           $scope.noResults = true;
          //         }, function (error) {
          //           console.log(error)
          //         });

          //     } else {

          //       if(favAccommArray.indexOf(favItem) == 0) {
          //         favAccommArray.shift();
          //         var updatedScopeArray = [];
          //         for (var x = 0; x < currentAccommArray.length; x++ ) {
          //           if(currentAccommArray[x].id != favItem) {
          //             updatedScopeArray.push(currentAccommArray[x])
          //           }
          //         }
          //         var newScopeArray = favAccommArray;
          //         var updatedArray = favAccommArray.join();
          //         $cordovaFile.writeFile(cordova.file.dataDirectory, "favourites.txt", updatedArray, true)
          //           .then(function (success) {
                      
          //             $scope.accommodations = updatedScopeArray;

          //           }, function (error) {
          //             console.log(error)
          //           });
          //       } else {

          //         favAccommArray.splice(favAccommArray.indexOf(favItem), favAccommArray.indexOf(favItem));
          //         var updatedScopeArray = [];
          //         for (var x = 0; x < currentAccommArray.length; x++ ) {
          //           if(currentAccommArray[x].id != favItem) {
          //             updatedScopeArray.push(currentAccommArray[x])
          //           }
          //         }
          //         var newScopeArray = favAccommArray;
          //         var updatedArray = favAccommArray.join();
          //         $cordovaFile.writeFile(cordova.file.dataDirectory, "favourites.txt", updatedArray, true)
          //           .then(function (success) {

          //             $scope.accommodations = updatedScopeArray;

          //           }, function (error) {
          //             console.log(error)
          //           });
          //       }
                
          //     }   
              
          //   }, function (error) {
          //     console.log(error)
          //   });

        } else if (buttonIndex == 2) {

        }

      }

    }
    
  }, $rootScope.contentTimeOut);

}])