import Ember from 'ember';

export default Ember.Component.extend({
  locationService: Ember.inject.service(),
  lat: null,
  lng: null,
  insertMap: function() {
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
      new window.google.maps.Map(container, options);
    }
  }.observes('lat', 'lng'),
  actions: {
    updateMap() {
      var component = this;
      var locationService = this.get('locationService');
      var zip = this.get('zip');
      var setLatLng = function(params) {
        component.set('lat', params.lat);
        component.set('lng', params.lng);
      };
      locationService.getLatLngFromZip(zip, setLatLng);

    }


  }
});
