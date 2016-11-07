import Ember from 'ember';

export default Ember.Service.extend({
  latlng: null,
  getLatLngFromZip(zipcode, fn) {
    var geocoder = new window.google.maps.Geocoder();
    var output;
    geocoder.geocode( { 'address': `'${zipcode}'`}, function(results, status) {
      if (status === 'OK') {
        output = {
         lat: results[0].geometry.location.lat(),
         lng: results[0].geometry.location.lng()
        };
        if(fn) {
          fn(output);
        }
      } else {
        //handle error
      }
    });
  }
});
