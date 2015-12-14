# aa-app
Fix ios location watch position errors by editing this piece of code in "C:\Users\User\Desktop\aa-app\plugins\cordova-plugin-geolocation\src\ios\CDVLocation.m":
if (enableHighAccuracy) {
    // snipped
    // self.locationManager.distanceFilter = 5;// original, causes problems standing still
    self.locationManager.distanceFilter = kCLDistanceFilterNone;
    //snipped
}
