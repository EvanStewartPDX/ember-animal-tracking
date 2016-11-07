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
  },
  addMap(container) {
    var lat = this.get('lat');
    var lng = this.get('lng');
    if(lat && lng) {

      var container =  this.$('.map-canvas')[0];
      var options = {
          center: new window.google.maps.LatLng(
            this.get('lat'),
            this.get('lng')
          ),
          mapTypeId: 'satellite',
          zoom: 15
      };
      console.log(`Lat: ${lat}, Lng: ${lng}`);
      var map = new window.google.maps.Map(container, options);
      new window.google.maps.Marker({
        position: {lat: lat, lng: lng},
        map: map,
        title: 'test'
      });
    }
  }

});
