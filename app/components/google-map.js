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

    },

    // var taxa = this.get('type');
    // var lat = "";
    // var long = "";
    // var radius = this.get('zoom');
    //
    //
    // getResults(results)
    //     var results = $.get('http://api.inaturalist.org/v1/observations?iconic_taxa='+ taxa +'&lat='+ lat +'&lng=-'+ lon +'&radius='+ zoom +'&updated_since=2016&order=desc&order_by=created_at').then(function(results) {
    //
    //     var apiObjects = [];
    //     for(var i = 0;i < results.length;i++) {
    //     	apiObjects[i] = {
    //       	name:result[i].species_guess,
    //         photo:result[i].photo.url,
    //         location:result[i].location,
    //         }
    //       }
    //     });


  }
});
