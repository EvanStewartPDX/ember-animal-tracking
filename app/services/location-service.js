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
    var google = window.google;
    var marker = new window.google.maps.Marker({
      position: { lat: lat, lng: lng },
      map: map
    });
    marker['infowindow'] = title;
    var infowindow = new google.maps.InfoWindow({});
    google.maps.event.addListener(marker , 'click', function(){
      infowindow.setContent(this['infowindow']);
      infowindow.open(map, this);
    });
  },

  getResults(map, lat, lng) {
    var service = this;
    var taxa = 'Aves';
    return Ember.$.get('http://api.inaturalist.org/v1/observations?iconic_taxa='+ taxa +'&lat='+ lat +'&lng='+ lng  +'&updated_since=2016&order=desc&order_by=created_at').then(data => {
      data.results.forEach(result => {
        var location = result.location.split(',');
        if(location) {
          service.addMarker(map, parseFloat(location[0]), parseFloat(location[1]), 'test');
        }
      });
    });
  }

});
