import Ember from 'ember';

export default Ember.Service.extend({
  latlng: null,
  infowindows: [],
  detail: null,
  loading: false,
  activities: Ember.A([]),
  taxa: null,

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
    var service = this;
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
      google.maps.event.addListener(map, 'idle', function() {
        var swlat = map.getBounds().getSouthWest().lat();
        var swlng = map.getBounds().getSouthWest().lng();
        var nelat = map.getBounds().getNorthEast().lat();
        var nelng = map.getBounds().getNorthEast().lng();
        service.getResultsByBounds(map, nelat, nelng, swlat, swlng, service.get('taxa'));
      });
      return map;
    }
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

  getResults(map, lat, lng, radius, taxa) {
    this.getCampsites(map, lat, lng, radius);
    var service = this;
    service.set('taxa', taxa);
    return Ember.$.get(`http://api.inaturalist.org/v1/observations?iconic_taxa=${taxa}&per_page=200&radius=${radius}&page=1&lat=${lat}&lng=${lng}&updated_since=2016&order=desc&order_by=votes`).then(data => {
      data.results.forEach(result => {
        var location = result.location.split(',');
        var color = '000000';
        switch(result.taxon.iconic_taxon_name) {
          case 'Aves':
            color = 'CC0000';
            break;
          case 'Mammalia':
            color = '0000CC';
            break;
          case 'Amphibia':
            color = '00CC00';
            break;
          case 'Arachnida':
            color = '00CCCC';
            break;
          case 'Fungi':
            color = 'CCCC00';
            break;
          case 'Insecta':
            color = '00A0A0';
            break;
          case 'Mollusca':
            color = '9932CC';
            break;
          case 'Reptilia':
            color = 'FFA500';
            break;
          }
          var markerImg = this.createMarkerImgFromColor(color);
        if(location) {
          var title;
          if (result.species_guess) {
            title = result.species_guess;
          } else {
            title = result.taxon.name;
          }
          service.addMarker(map, parseFloat(location[0]), parseFloat(location[1]), title, result.id, markerImg, 'animal');
        }
      });
    });
  },

  getResultsByBounds(map, nelat, nelng, swlat, swlng, taxa) {
    // this.getCampsites(map, lat, lng, radius);
    var service = this;
    return Ember.$.get(`http://api.inaturalist.org/v1/observations?iconic_taxa=${taxa}&per_page=200&&page=1&nelat=${nelat}&nelng=${nelng}&swlat=${swlat}&swlng=${swlng}&updated_since=2016&order=desc&order_by=votes`).then(data => {
      data.results.forEach(result => {
        var location = result.location.split(',');
        var color = '000000';
        switch(result.taxon.iconic_taxon_name) {
          case 'Aves':
            color = 'CC0000';
            break;
          case 'Mammalia':
            color = '0000CC';
            break;
          case 'Amphibia':
            color = '00CC00';
            break;
          case 'Arachnida':
            color = '00CCCC';
            break;
          case 'Fungi':
            color = 'CCCC00';
            break;
          case 'Insecta':
            color = '00A0A0';
            break;
          case 'Mollusca':
            color = '9932CC';
            break;
          case 'Reptilia':
            color = 'FFA500';
            break;
          }
          var markerImg = this.createMarkerImgFromColor(color);
        if(location) {
          var title;
          if (result.species_guess) {
            title = result.species_guess;
          } else {
            title = result.taxon.name;
          }
          service.addMarker(map, parseFloat(location[0]), parseFloat(location[1]), title, result.id, markerImg, 'animal');
        }
      });
    });
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

  getCampsites(map, lat, lng, radius) {
    var service = this;
    Ember.$.ajax({
         url: `https://trailapi-trailapi.p.mashape.com/?lat=${lat}&limit=25&lon=${lng}&radius=${radius}`,
         type: "GET",
         beforeSend: function(xhr){xhr.setRequestHeader('X-Mashape-Key', 'Poz6aqze7Umshf3xwOZPtqq5rpYLp1A7ofGjsnbUXhxDCjqT8x');},
         success: function(response) {
           console.log(response.places);
           var markerImg = service.createMarkerImg();
           response.places.forEach(place => {
             service.get('activities').pushObject(place);
             service.addMarker(map, parseFloat(place.lat), parseFloat(place.lon), place.name, place.unique_id, markerImg, 'activity');
           });
         }
      });
  }

});
