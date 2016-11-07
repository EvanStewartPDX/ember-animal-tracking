import Ember from 'ember';

export default Ember.Route.extend({
  locationService: Ember.inject.service(),
  init() {
    var locationService = this.get('locationService');
    locationService.getLatLngFromZip('98664');
  }
});
