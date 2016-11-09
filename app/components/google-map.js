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
  campgroundsChecked: false,
  loading: false,

  onDetailChange: Ember.observer('locationService.detail', function() {
    var locationService = this.get('locationService');
    this.set('detail', locationService.detail);
  }).on('init'),

  insertMap: function() {
    var locationService = this.get('locationService');
    var lat = this.get('lat');
    var lng = this.get('lng');
    var container = this.$('.map-canvas')[0];
    if(lat && lng) {
      var radius = this.get('radius');
      var map = locationService.addMap(container, lat, lng, radius);
      this.set('map', map);
    }
  }.observes('lat', 'lng'),

  onZoomChange: function() {
    this.get('locationService').setZoom(this.get('radius'));
  }.observes('radius'),

  onAvesChange: function() {
    if(this.get('avesChecked')) {
      this.get('locationService').addTaxa('Aves');
    } else {
      this.get('locationService').removeTaxa('Aves');
    }
  }.observes('avesChecked'),

  onMammalsChange: function() {
    if(this.get('mammaliaChecked')) {
      this.get('locationService').addTaxa('Mammalia');
    } else {
      this.get('locationService').removeTaxa('Mammalia');
    }
  }.observes('mammaliaChecked'),

  onAmphibiaChange: function() {
    if(this.get('amphibiansChecked')) {
      this.get('locationService').addTaxa('Amphibia');
    } else {
      this.get('locationService').removeTaxa('Amphibia');
    }
  }.observes('amphibiansChecked'),

  onArachnidaChange: function() {
    if(this.get('arachnidaChecked')) {
      this.get('locationService').addTaxa('Arachnida');
    } else {
      this.get('locationService').removeTaxa('Arachnida');
    }
  }.observes('arachnidaChecked'),

  onFungiChange: function() {
    if(this.get('fungiChecked')) {
      this.get('locationService').addTaxa('Fungi');
    } else {
      this.get('locationService').removeTaxa('Fungi');
    }
  }.observes('fungiChecked'),

  onInsectaChange: function() {
    if(this.get('insectaChecked')) {
      this.get('locationService').addTaxa('Insecta');
    } else {
      this.get('locationService').removeTaxa('Insecta');
    }
  }.observes('insectaChecked'),

  onMolluscaChange: function() {
    if(this.get('molluscaChecked')) {
      this.get('locationService').addTaxa('Mollusca');
    } else {
      this.get('locationService').removeTaxa('Mollusca');
    }
  }.observes('molluscaChecked'),

  onReptiliaChange: function() {
    if(this.get('reptillaChecked')) {
      this.get('locationService').addTaxa('Reptilia');
    } else {
      this.get('locationService').removeTaxa('Reptilia');
    }
  }.observes('reptillaChecked'),

  onCampgroundsChange: function() {
    if(this.get('campgroundsChecked')) {
      this.get('locationService').set('showCampgrounds', true);
    } else {
      this.get('locationService').set('showCampgrounds', false);
    }
  }.observes('campgroundsChecked'),

  actions: {
    updateMap() {
      var locationService = this.get('locationService');
      var component = this;
      var address = this.get('address');
      var setLatLng = function(params) {
        component.set('lat', params.lat);
        component.set('lng', params.lng);
        component.set('detail', null);
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

  },

});
