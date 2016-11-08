import Ember from 'ember';

export default Ember.Component.extend({
  locationService: Ember.inject.service(),
  lat: null,
  lng: null,
  map: null,

  insertMap: function() {
    var locationService = this.get('locationService');
    var lat = this.get('lat');
    var lng = this.get('lng');
    var container = this.$('.map-canvas')[0];
    if(lat && lng) {
      console.log(lat, lng);
      var map = locationService.addMap(container, lat, lng);
      this.set('map', map);
      locationService.getResults(map, lat,lng);
    }
  }.observes('lat', 'lng'),

  actions: {
    updateMap() {
      var locationService = this.get('locationService');
      var component = this;
      var address = this.get('address');
      var setLatLng = function(params) {
        component.set('lat', params.lat);
        component.set('lng', params.lng);
      };
      locationService.getLatLngFromZip(address, setLatLng);
    },

    addMarker() {
      var locationService = this.get('locationService');
      var lat = parseFloat(this.get('mlat'));
      var lng = parseFloat(this.get('mlng'));
      var title = this.get('title');
      var map = this.get('map');
      locationService.addMarker(map, lat, lng, title);
    },

  }

});
