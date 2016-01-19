angular.module('contact.us.controller', [])

.controller('ContactUsCtrl', ['$scope', '$rootScope', '$cordovaDatePicker', '$stateParams', '$ionicHistory', '$timeout', '$http', '$window', function($scope, $rootScope, $cordovaDatePicker, $stateParams, $ionicHistory, $timeout, $http, $window) {

  $scope.$on('$ionicView.enter', function() {
    $rootScope.showTabs = true;
    $rootScope.showBack = false;    
    $rootScope.enquireBtn = false;
  });

  // $scope.$on('$ionicView.leave', function() {
  //   document.getElementById("name").removeClass('');
  // });

  $timeout(function(){

    $scope.submitContactUs = function(name, email, mobile, message) {

      if(typeof name === 'undefined' || typeof email === 'undefined' || typeof message === 'undefined') {

        $scope.errors = true;

        navigator.notification.alert(
          'Please correct the errors before sending the form again',  // message
          null,                     // callback
          'Alert',                // title
          'Done'                  // buttonName
        );

      } else {

        $scope.showSending = true;
        
        var contactUsFormObj = {
          "mobile" : mobile,
          "udid" : ionic.Platform.device().uuid,
          "email" : email,
          "type" : "contact_us",
          "name" : name,
          "message" : message
        }

        $http({
          method: 'POST',
          url: 'http://www.aatravel.co.za/_mobi_app/post.php',
          data: contactUsFormObj,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function successCallback(response) {

          $scope.showSending = false;

          function enquireSuccess() {
            cordova.plugins.Keyboard.close();
          }

          navigator.notification.alert(
            'Your email has been sent successfully.',  // message
            enquireSuccess,                     // callback
            'Alert',                // title
            'Done'                  // buttonName
          );

        }, function errorCallback(response) {

          navigator.notification.alert(
            'We regret that there is a problem sending your email. Error: '+response,  // message
            null,                     // callback
            'Alert',                // title
            'Done'                  // buttonName
          );

        });

      }      

    }

  }, $rootScope.contentTimeOut);

}])