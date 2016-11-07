import Ember from 'ember';

export default Ember.Service.extend({
  latlng: null,
  getLatLngFromZip(address, fn) {
    var geocoder = new window.google.maps.Geocoder();
    var output;
    geocoder.geocode( { 'address': `'${address}'`}, function(results, status) {
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
  addMap(container, lat, lng) {
    if(lat && lng) {
      var options = {
          center: new window.google.maps.LatLng(lat, lng),
          mapTypeId: 'satellite',
          zoom: 15
      };
      return new window.google.maps.Map(container, options);
    }
  },
  addMarker(map, lat, lng, title) {
    return new window.google.maps.Marker({
      position: {lat: lat, lng: lng},
      map: map,
      title: title
    });
  }

});
