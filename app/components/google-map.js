import Ember from 'ember';

export default Ember.Component.extend({
  locationService: Ember.inject.service(),
  lat: null,
  lng: null,
  map: null,
  detail: null,
  radius: 1,
  avesChecked: false,
  mammaliaChecked: false,
  amphibiansChecked: false,
  arachnidaChecked: false,
  fungiChecked: false,
  insectaChecked: false,
  molluscaChecked: false,
  reptillaChecked: false,
  loading: false,

  onDetailChange: Ember.observer('locationService.detail', function() {
    var locationService = this.get('locationService');
    console.log(locationService.detail);
    this.set('detail', locationService.detail);
  }).on('init'),

  insertMap: function() {

    var locationService = this.get('locationService');
    var lat = this.get('lat');
    var lng = this.get('lng');
    var container = this.$('.map-canvas')[0];
    if(lat && lng) {
      this.set('loading', true);
      var taxa = "";
      if(this.get('avesChecked')) {
        taxa += 'Aves%2C';
      }
      if(this.get('mammaliaChecked')) {
        taxa += 'Mammalia%2C';
      }
      if(this.get('amphibiansChecked')) {
        taxa += 'Amphibia%2C';
      }
      if(this.get('arachnidaChecked')) {
        taxa += 'Arachnida%2C';
      }
      if(this.get('fungiChecked')) {
        taxa += 'Fungi%2C';
      }
      if(this.get('insectaChecked')) {
        taxa += 'Insecta%2C';
      }
      if(this.get('molluscaChecked')) {
        taxa += 'Mollusca%2C';
      }
      if(this.get('reptillaChecked')) {
        taxa += 'Reptilia%2C';
      }

      var zoom;
      switch(this.get('radius')) {
        case 1:
          zoom = 14;
          break;
        case 7:
          zoom = 12;
          break;
        case 16:
          zoom = 10;
          break;
        case 40:
          zoom = 9;
          break;
        case 90:
          zoom = 8;
          break;
        case 160:
          zoom = 7;
          break;
      }

      var map = locationService.addMap(container, lat, lng, zoom);
      this.set('map', map);
      var radius = this.get('radius');
      locationService.getResults(map, lat, lng, radius, taxa).then(() => {
        this.set('loading', false);
      });
    }
  }.observes('lat', 'lng', 'radius', 'avesChecked', 'mammaliaChecked', 'amphibiansChecked', 'arachnidaChecked', 'fungiChecked', 'insectaChecked', 'molluscaChecked', 'reptillaChecked'),

  actions: {
    updateMap() {
      this.set('loading', true);
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

    radiusChange(value) {
      this.set('radius', parseInt(value));
    },

    // avesChange() {
    //   console.log(this.get('avesCheck'));
    // }
  },

});
