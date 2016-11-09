import Ember from 'ember';

export default Ember.Service.extend({
  latLngRad: null,
  infowindows: [],
  detail: null,
  loading: false,
  activities: Ember.A([]),
  mapBounds: null,
  taxas: Ember.A([]),
  Aves: Ember.A([]),
  Mammalia: Ember.A([]),
  Amphibia: Ember.A([]),
  Arachnida: Ember.A([]),
  Fungi: Ember.A([]),
  Insecta: Ember.A([]),
  Mollusca: Ember.A([]),
  Reptilia: Ember.A([]),
  Campgrounds: Ember.A([]),
  showCampgrounds: false,

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

  addMap(container, lat, lng, miles) {
    var zoomLevel = this.convertMilesToZoomLevel(miles);
    var service = this;
    var google = window.google;
    if(lat && lng) {
      var options = {
          center: new google.maps.LatLng(lat, lng),
          mapTypeId: 'satellite',
          zoom: zoomLevel,
          disableDefaultUI: true
      };
      var map = new google.maps.Map(container, options);
      service.set('map', map);
      google.maps.event.addListener(map, 'idle', function() { service._setBoundsFromMap(map); });
      return map;
    }
  },

  setZoom(miles) {
    var map = this.get('map');
    if(map) {
      var zoomLevel = this.convertMilesToZoomLevel(miles);
      map.setZoom(zoomLevel);
    }
  },

  convertMilesToZoomLevel(miles) {
    var zoomLevel;
    switch(miles) {
      case 1:
        zoomLevel = 14;
        break;
      case 7:
        zoomLevel = 12;
        break;
      case 16:
        zoomLevel = 10;
        break;
      case 40:
        zoomLevel = 9;
        break;
      case 90:
        zoomLevel = 8;
        break;
      case 160:
        zoomLevel = 7;
        break;
    }
    return zoomLevel;
  },

  removeTaxa(taxa) {
    this.get('taxas').removeObject(taxa);
    this.get(taxa).forEach(marker => {
      marker.setMap(null);
    });
  },

  addTaxa(taxa) {
    this.get('taxas').pushObject(taxa);
  },

  addMarker(map, lat, lng, title, id, markerImg, type) {
    var service = this;
    var google = window.google;

    var marker = new window.google.maps.Marker({
      position: { lat: lat, lng: lng },
      map: map,
      icon: markerImg
    });
    marker['infowindow'] = title;
    marker['observation_id'] = id;

    google.maps.event.addListener(marker , 'click', function(){
      var infowindows = service.get('infowindows');
      if(infowindows) {
        infowindows.forEach(window => {
          window.close();
        });
      }

      service.set('detail_id', id);
      service.set('detail_type', type);
      if(type === 'animal') {
        service.getSingleResults(id).then(detail => {
          service.set('detail', detail);
        });
      } else if (type === 'activity') {
        service.getSingleActivityResults(id);
      }

      var infowindow = new google.maps.InfoWindow({});
      infowindows.pushObject(infowindow);
      infowindow.setContent(this['infowindow']);
      service.set('openWindow', this);
      infowindow.open(map, this);
    });
    return marker;
  },

  createMarkerImgFromColor(color) {
    var google = window.google;
    return new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + color,
      new google.maps.Size(21, 34),
      new google.maps.Point(0,0),
      new google.maps.Point(10, 34));
  },

  createMarkerImg() {
    var google = window.google;
    return new google.maps.MarkerImage("http://maps.google.com/mapfiles/ms/icons/campground.png");
  },

  getResultsByBounds: function() {
    var service = this;
    var taxas = service.get('taxas');
    var mapBounds = service.get('mapBounds');
    var map = service.get('map');
    if(taxas.get('length') > 0 && mapBounds) {
      var taxaURL = "";
      taxas.forEach(taxa => {
        taxaURL += taxa + '%2C';
      });
      return Ember.$.get(`http://api.inaturalist.org/v1/observations?iconic_taxa=${taxaURL}&per_page=200&&page=1&nelat=${mapBounds.nelat}&nelng=${mapBounds.nelng}&swlat=${mapBounds.swlat}&swlng=${mapBounds.swlng}&updated_since=2016&order=desc&order_by=votes`).then(data => {
        data.results.forEach(result => {
          this.createMarkerForAnimal(result, map);
        });
      });
    }
  }.observes('mapBounds', 'taxas.@each'),

  createMarkerForAnimal(result, map) {
    var location = result.location.split(',');
    if(location) {
      var title;
      if (result.species_guess) {
        title = result.species_guess;
      } else {
        title = result.taxon.name;
      }
      var markerImg;
      var marker;
      switch(result.taxon.iconic_taxon_name) {
        case 'Aves':
          markerImg = this.createMarkerImgFromColor('CC0000');
          marker = this.addMarker(map, parseFloat(location[0]), parseFloat(location[1]), title, result.id, markerImg, 'animal');
          this.get('Aves').pushObject(marker);
          break;
        case 'Mammalia':
          markerImg = this.createMarkerImgFromColor('0000CC');
          marker = this.addMarker(map, parseFloat(location[0]), parseFloat(location[1]), title, result.id, markerImg, 'animal');
          this.get('Mammalia').pushObject(marker);
          break;
        case 'Amphibia':
          markerImg = this.createMarkerImgFromColor('00CC00');
          marker = this.addMarker(map, parseFloat(location[0]), parseFloat(location[1]), title, result.id, markerImg, 'animal');
          this.get('Amphibia').pushObject(marker);
          break;
        case 'Arachnida':
          markerImg = this.createMarkerImgFromColor('00CCCC');
          marker = this.addMarker(map, parseFloat(location[0]), parseFloat(location[1]), title, result.id, markerImg, 'animal');
          this.get('Arachnida').pushObject(marker);
          break;
        case 'Fungi':
          markerImg = this.createMarkerImgFromColor('CCCC00');
          marker = this.addMarker(map, parseFloat(location[0]), parseFloat(location[1]), title, result.id, markerImg, 'animal');
          this.get('Fungi').pushObject(marker);
          break;
        case 'Insecta':
          markerImg = this.createMarkerImgFromColor('00A0A0');
          marker = this.addMarker(map, parseFloat(location[0]), parseFloat(location[1]), title, result.id, markerImg, 'animal');
          this.get('Insecta').pushObject(marker);
          break;
        case 'Mollusca':
          markerImg = this.createMarkerImgFromColor('9932CC');
          marker = this.addMarker(map, parseFloat(location[0]), parseFloat(location[1]), title, result.id, markerImg, 'animal');
          this.get('Mollusca').pushObject(marker);
          break;
        case 'Reptilia':
          markerImg = this.createMarkerImgFromColor('FFA500');
          marker = this.addMarker(map, parseFloat(location[0]), parseFloat(location[1]), title, result.id, markerImg, 'animal');
          this.get('Reptilia').pushObject(marker);
          break;
        }
    }
  },


  getSingleResults(id) {
    return Ember.$.get(`http://api.inaturalist.org/v1/observations/${id}`).then(data => {
      return data.results[0];
    });
  },

  getSingleActivityResults(id) {
    var detail = this.get('activities').find(x => { return x.unique_id === id; });
    this.set('detail', detail);
  },

  getCampsites: function() {
    var service = this;
    var latLngRad = this.get('latLngRad');
    var map = this.get('map');
    if(service.get('showCampgrounds')) {
      Ember.$.ajax({
           url: `https://trailapi-trailapi.p.mashape.com/?lat=${latLngRad.lat}&limit=25&lon=${latLngRad.lng}&radius=${latLngRad.rad}`,
           type: "GET",
           beforeSend: function(xhr){xhr.setRequestHeader('X-Mashape-Key', 'Poz6aqze7Umshf3xwOZPtqq5rpYLp1A7ofGjsnbUXhxDCjqT8x');},
           success: function(response) {
             var markerImg = service.createMarkerImg();
             response.places.forEach(place => {
               service.get('activities').pushObject(place);
               var marker = service.addMarker(map, parseFloat(place.lat), parseFloat(place.lon), place.name, place.unique_id, markerImg, 'activity');
               service.get('Campgrounds').pushObject(marker);
             });
           }
        });
    } else {
      service.get('Campgrounds').forEach(marker => {
        marker.setMap(null);
      });
    }
  }.observes('latLngRad', 'showCampgrounds'),

  _setBoundsFromMap: function(map) {
    // r = radius of the earth in km
    var r = 6378.8;
    var bounds = map.getBounds();
    // degrees to radians (divide by 57.2958)
    var ne_lat = bounds.getNorthEast().lat() / 57.2958;
    var ne_lng = bounds.getNorthEast().lng() / 57.2958;
    var c_lat = bounds.getCenter().lat() / 57.2958;
    var c_lng = bounds.getCenter().lng() / 57.2958;
    // distance = circle radius from center to Northeast corner of bounds
    var r_km = r * Math.acos(
      Math.sin(c_lat) * Math.sin(ne_lat) +
      Math.cos(c_lat) * Math.cos(ne_lat) * Math.cos(ne_lng - c_lng)
    );
    var latLngRad = {
      lat: map.getCenter().lat(),
      lng: map.getCenter().lng(),
      rad: r_km
    };
    this.set('latLngRad', latLngRad);

    var mapBounds = {
      swlat: map.getBounds().getSouthWest().lat(),
      swlng: map.getBounds().getSouthWest().lng(),
      nelat: map.getBounds().getNorthEast().lat(),
      nelng: map.getBounds().getNorthEast().lng()
    };
    this.set('mapBounds', mapBounds);
  }
});
