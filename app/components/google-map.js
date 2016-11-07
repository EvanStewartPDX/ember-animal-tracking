import Ember from 'ember';

export default Ember.Component.extend({
  locationService: Ember.inject.service(),
  lat: null,
  lng: null,
  insertMap: function() {


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
