angular.module('destinations.accom.chosen.controller', [])

.controller('DestinationsAccomChosenCtrl', ['$scope', '$stateParams', '$http', '$cordovaGeolocation', '$rootScope', '$ionicSlideBoxDelegate', '$timeout', '$cordovaSocialSharing', '$state', '$ionicHistory', '$ionicLoading', '$window', '$ionicScrollDelegate', '$cordovaInAppBrowser', '$cordovaFile', function($scope, $stateParams, $http, $cordovaGeolocation, $rootScope, $ionicSlideBoxDelegate, $timeout, $cordovaSocialSharing, $state, $ionicHistory, $ionicLoading, $window, $ionicScrollDelegate, $cordovaInAppBrowser, $cordovaFile) {

  var enquireBtn = angular.element(document.getElementById('enquire-btn'));

  $scope.$on('$ionicView.enter', function() {
    $rootScope.showTabs = true;
    $rootScope.showBack = true;    
    $rootScope.enquireBtn = false;
    $rootScope.showMapBtn = false;

    if($ionicHistory.viewHistory().forwardView.stateName == "app.enquire-form") {
      enquireBtn.removeClass("ng-hide")
    }
    
  }); 

  $scope.$on('$ionicView.afterLeave', function() {
    enquireBtn.addClass("ng-hide")
  });

  $scope.state = $stateParams; 

  $timeout(function(){

    $ionicLoading.show({template: '<ion-spinner icon="dots"></ion-spinner>'})

    $http({
      method: 'GET',
      url: 'http://www.aatravel.co.za/_mobi_app/accomm_detail.php?accomm_id='+$stateParams.accomId
    }).then(function successCallback(response) {      

      $scope.openMaps = function(lat, long) {
        
        var options = {
          location: 'yes',
          clearcache: 'no',
          toolbar: 'yes'
        };

        $cordovaInAppBrowser.open('http://maps.google.com/?q='+lat+','+long+'', '_blank', options)
          .then(function(event) {
            // success
          })
          .catch(function(event) {
            // error
          });   
      }

      $ionicLoading.hide()        

      var data = response.data;

      // get aa rating
      $scope.aaRating = calculateRating(data);

      // get acomm price
      if(data[0].pl == "0.00") {
        $scope.accommodationPrice = "Price on enquiry"
      } else {
        $scope.accommodationPrice = data[0].pl+" ZAR"
      }     

      var scrollHeight = $window.innerHeight;
      $scope.setScrollHeight = scrollHeight+"px";        

      $ionicScrollDelegate.$getByHandle('scroll-accom-chosen').resize();

      $scope.scrollFunc = function() {

        if($ionicScrollDelegate.$getByHandle('scroll-accom-chosen').getScrollPosition().top + $window.innerHeight > $ionicScrollDelegate.$getByHandle('scroll-accom-chosen').getScrollView().__contentHeight - 600) {
          enquireBtn.removeClass("ng-hide")
        };

      }

      $rootScope.goToEnquireForm = function() {
        $state.go('app.enquire-form', {accomName: data[0].n, accomId: data[0].id}); 
      }

      $scope.accommodation = data[0];

      var accomGallery = data[0].g;
      var accomGalleryArray = accomGallery.split(",");
      $scope.accomGallery = accomGalleryArray

      $scope.imgLoaded = function(id) {

        var descriptionWrap = angular.element(document.getElementById(id));
        descriptionWrap.css({"display":"none"})

      }

      // create line breaks in description
      var descriptionWrap = angular.element(document.getElementById('desc'));
      var description = data[0].de;
      $scope.desc = description.replace(/\r\n\r\n/g, '<br><br>');

      // sanitize amenities, facilities and activities
      var amenitiesData = data[0].amen;
      if(amenitiesData != null) {
        $scope.amenities = amenitiesData.split(",");
      } else {
        $scope.amenities = ["Not available"];
      }    

      var facilitiesData = data[0].fac;
      if(facilitiesData != null) {
        $scope.facilities = facilitiesData.split(",");
      } else {
        $scope.facilities = ["Not available"];
      }   

      var activitiesData = data[0].act;
      if(activitiesData != null) {
        $scope.activities = activitiesData.split(",");
      } else {
        $scope.activities = ["Not available"];
      }   

      $scope.showContent = "accommodation";

      //change content area
      $scope.changeContent = function(tabType, currentTab) {

        var tabRemove = angular.element(document.getElementsByClassName("tab-item"));
        tabRemove.removeClass("active");

        var tab = angular.element(document.getElementById(currentTab));
        tab.addClass("active");

        switch(tabType) {
          case "accommodation":
            $scope.showContent = tabType;                
            break;
          case "reviews":
            $scope.showContent = tabType;
            break;
          case "amenities":
            $scope.showContent = tabType;
            break;
          case "activities":
            $scope.showContent = tabType;
            break;
          case "near":
            $scope.showContent = tabType;
            break;
          default:
            contentWrap.html("There was an error loading the content");
        }

      } 

      // sanitize number
      var number = data[0].con;
      $scope.number = number.replace(/[^a-z0-9\s]/gi, '').substring(0, 10);

      $scope.share = function(name, type, accomId) {

        var message = name+", "+type+", http://www.aatravel.co.za/PA"+accomId;
        var link;
        var image;

        $cordovaSocialSharing
          .share(message, image, link)
          .then(function(result) {
            console.log("Social share successful")
          }, function(err) {
            console.log("Social share failed")
          })

      }

      // load map for single accommodation
      $timeout(function(){

        var latlng = new google.maps.LatLng(data[0].lat, data[0].lon);
        var myOptions = {
            zoom: 12,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
        };            
        var map = new google.maps.Map(document.getElementById("single_accom_map_canvas"), myOptions);

        var image = 'img/markers/accom-marker.svg';
        var marker = new google.maps.Marker({
          position: latlng,
          map: map,
          icon: image
        });
        $scope.map = map
        $scope.overlay = new google.maps.OverlayView();
        $scope.overlay.draw = function() {}; // empty function required
        $scope.overlay.setMap($scope.map);
        $scope.element = document.getElementById('single_accom_map_canvas');

      }, 500);

      $scope.saveFavAccomm = function() {
        var accommId = $scope.accommodation;

        $cordovaFile.checkFile(cordova.file.dataDirectory, "favourites.txt")
          .then(function (success) {

            // get file contents to check for duplicate id's
            $cordovaFile.readAsText(cordova.file.dataDirectory, "favourites.txt")
              .then(function (success) {

                var favAccommArray = success.split(",")
                if(favAccommArray.indexOf(accommId.id) >= 0) {
                  navigator.notification.alert(
                    'You already have this accommodation as a favourite.',  // message
                    null,                     // callback
                    'Alert',                // title
                    'Done'                  // buttonName
                  );
                } else {
                  $cordovaFile.writeExistingFile(cordova.file.dataDirectory, "favourites.txt", ","+accommId.id)
                    .then(function (success) {

                      navigator.notification.alert(
                        'Accommodation added to favourites',  // message
                        null,                     // callback
                        'Alert',                // title
                        'Done'                  // buttonName
                      );

                    }, function (error) {
                      console.log(error)
                    });
                }

              }, function (error) {
                console.log(error)
              });
            
          }, function (error) {

            $cordovaFile.writeFile(cordova.file.dataDirectory, "favourites.txt", accommId.id, false)
              .then(function (success) {
                
                navigator.notification.alert(
                  'Accommodation added to favourites',  // message
                  null,                     // callback
                  'Alert',                // title
                  'Done'                  // buttonName
                );

              }, function (error) {
                console.log(error)
              });
                          
          });

      }

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