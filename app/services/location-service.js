import Ember from 'ember';

export default Ember.Service.extend({
  latlng: null,
  infowindows: [],
  detail: null,
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

  addMap(container, lat, lng, zoom) {
    if(lat && lng) {
      var options = {
          center: new window.google.maps.LatLng(lat, lng),
          mapTypeId: 'satellite',
          zoom: zoom
      };
      var map = new window.google.maps.Map(container, options);
      var infowindow;
      var google = window.google;
      google.maps.event.addListener(map, 'click', function() {
        if (infowindow) {
            infowindow.close();
        }
      });
      return map;
    }
  },

  addMarker(map, lat, lng, title, id) {
    var service = this;
    var google = window.google;
    var marker = new window.google.maps.Marker({
      position: { lat: lat, lng: lng },
      map: map
    });
    marker['infowindow'] = title;
    marker['observation_id'] = id;

    google.maps.event.addListener(marker , 'click', function(){
      // var infowindows = service.get('infowindows');
      // if(infowindows) {
      //   infowindows.forEach(window => {
      //     window.close();
      //   });
      // }
      // service.set('detail_id', id);
      service.getSingleResults(id).then(detail => {
        service.set('detail', detail);
      });
      // var infowindow = new google.maps.InfoWindow({});
      // infowindows.pushObject(infowindow);
      // infowindow.setContent(this['infowindow']);
      // service.set('openWindow', this);
      // infowindow.open(map, this);
    });
  },

  getResults(map, lat, lng, radius, taxa) {
    var service = this;
    // var taxa = 'Aves';
    console.log(taxa);
    return Ember.$.get(`http://api.inaturalist.org/v1/observations?iconic_taxa=${taxa}&per_page=200&radius=${radius}&page=1&lat=${lat}&lng=${lng}&updated_since=2016&order=desc&order_by=votes`).then(data => {
      data.results.forEach(result => {
        var location = result.location.split(',');
        if(location) {
          service.addMarker(map, parseFloat(location[0]), parseFloat(location[1]), result.species_guess, result.id);
        }
      });
    });
  },

  getSingleResults(id) {
    return Ember.$.get(`http://api.inaturalist.org/v1/observations/${id}`).then(data => {
      return data.results[0];
    });
  }

});
