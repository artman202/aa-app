angular.module('about.us.controller', [])

.controller('AboutUsCtrl', ['$scope', '$rootScope', '$cordovaDatePicker', '$stateParams', '$ionicHistory', '$timeout', '$http', function($scope, $rootScope, $cordovaDatePicker, $stateParams, $ionicHistory, $timeout, $http) {

  $scope.$on('$ionicView.enter', function() {
    $rootScope.showTabs = true;
    $rootScope.showBack = true;    
    $rootScope.enquireBtn = false;
  });

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
        
        var contactUsFormObj = {
          "mobile" : mobile,
          "udid" : "E8AB9C2E-520A-4DFD-B024-8D1B02989B04",
          "email" : email,
          "type" : "enquire",
          "name" : name,
          "message" : name
        }

        alert("Message sent!")

        console.log(contactUsFormObj);

        // $http({
        //   method: 'POST',
        //   url: 'http://www.aatravel.co.za/_mobi_app/post.php',
        //   data: enquiryFormObj,
        //   headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        // }).then(function successCallback(response) {

        //   function enquireSuccess() {
        //     $ionicHistory.goBack();
        //   }

        //   navigator.notification.alert(
        //     'Your email has been sent successfully.',  // message
        //     enquireSuccess,                     // callback
        //     'Alert',                // title
        //     'Done'                  // buttonName
        //   );

        // }, function errorCallback(response) {

        //   navigator.notification.alert(
        //     'We regret that there is a problem sending your email. Error'+response,  // message
        //     null,                     // callback
        //     'Alert',                // title
        //     'Done'                  // buttonName
        //   );

        // });

      }      

    }

  }, $rootScope.contentTimeOut);

}])