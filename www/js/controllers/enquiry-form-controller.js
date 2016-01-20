angular.module('enquiry.form.controller', [])

.controller('EnquireFormCtrl', ['$scope', '$rootScope', '$cordovaDatePicker', '$stateParams', '$ionicHistory', '$timeout', '$http', function($scope, $rootScope, $cordovaDatePicker, $stateParams, $ionicHistory, $timeout, $http) {

  $scope.$on('$ionicView.enter', function() {
    $rootScope.showTabs = true;
    $rootScope.showBack = true;
  });

  $timeout(function(){

    $scope.runDatePickerCheckin = function() {

      var options = {
        date: new Date(),
        mode: 'date', // or 'time'
        minDate: new Date() - 1000,
        maxDate: new Date() + 10000,
        allowOldDates: false,
        allowFutureDates: true,
        doneButtonLabel: 'DONE',
        doneButtonColor: '#000000',
        cancelButtonLabel: 'CANCEL',
        cancelButtonColor: '#c3c3c3'
      };
      
      $cordovaDatePicker.show(options).then(function(date){

        console.log(date);
        var dateStr = String(date);
        $scope.checkIn = dateStr.substr(0, 15);
        
      });

    }

    $scope.runDatePickerCheckout = function() {

      var options = {
        date: new Date(),
        mode: 'date', // or 'time'
        minDate: new Date() - 1000,
        maxDate: new Date() + 10000,
        allowOldDates: false,
        allowFutureDates: true,
        doneButtonLabel: 'DONE',
        doneButtonColor: '#000000',
        cancelButtonLabel: 'CANCEL',
        cancelButtonColor: '#c3c3c3'
      };
      
      $cordovaDatePicker.show(options).then(function(date){

        console.log(date);
        var dateStr = String(date);
        $scope.checkOut = dateStr.substr(0, 15);
        
      });

    }

    $scope.submitEnquire = function(name, email, mobile, checkIn, checkOut) {

      console.log(checkIn);

      if(typeof name === 'undefined' || typeof email === 'undefined' || typeof checkIn === 'undefined' || typeof checkOut === 'undefined') {

        $scope.errors = true;

        navigator.notification.alert(
          'Please correct the errors before sending the form again',  // message
          null,                     // callback
          'Alert',                // title
          'Done'                  // buttonName
        );

      } else {

        $scope.showSending = true;
        
        var enquiryFormObj = {
          "mobile" : mobile,
          "accomm_id" : $stateParams.accomId,
          "checkin" : checkIn,
          "udid" : ionic.Platform.device().uuid,
          "email" : email,
          "type" : "enquire",
          "name" : name,
          "checkout" : checkOut
        }

        $http({
          method: 'POST',
          url: 'http://www.aatravel.co.za/_mobi_app/post.php',
          data: enquiryFormObj,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function successCallback(response) {

          function enquireSuccess() {
            $scope.showSending = false;
            $ionicHistory.goBack();
          }

          navigator.notification.alert(
            'Your email has been sent successfully.',  // message
            enquireSuccess,                     // callback
            'Alert',                // title
            'Done'                  // buttonName
          );

        }, function errorCallback(response) {

          navigator.notification.alert(
            'We regret that there is a problem sending your email. Error'+response,  // message
            null,                     // callback
            'Alert',                // title
            'Done'                  // buttonName
          );

        });

      }      

    }

  }, $rootScope.contentTimeOut);

}])