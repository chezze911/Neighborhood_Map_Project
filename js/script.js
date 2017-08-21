

  var defaultLocations = [
      {title: 'Misora', location: {lat: 37.319926, lng: -121.946511}},
      {title: 'Park Kiely', location: {lat: 37.319817, lng: -121.976738}},
      {title: '808 West Apartments', location: {lat: 37.317033, lng: -121.841314}},
      {title: 'The Pierce', location: {lat: 37.327007, lng: -121.884473}},
      {title: 'Fruitdale Station Apartments', location: {lat: 37.309412, lng: -121.918435}},
      {title: 'Avalon at Cahill Park', location: {lat: 37.331571, lng: -121.905183}}
    ];

  var map;

  // Create a new blank array for all the listing markers.
  var markers = [];

  // Create placemarkers array to use in multiple functions to have control over the number of places that show.
  var placeMarkers = [];

//   var SimpleListModel = function(items) {
//     this.items = ko.observableArray(items);
//     this.itemToAdd = ko.observable("");
//     this.addItem = function() {
//         if (this.itemToAdd() != "") {
//             this.items.push(this.itemToAdd()); // Adds the item. Writing to the "items" observableArray causes any associated UI to update.
//             this.itemToAdd(""); // Clears the text box, because it's bound to the "itemToAdd" observable
//         }
//     }.bind(this);  // Ensure that "this" is always this view model
// };
 
// ko.applyBindings(new SimpleListModel(["Misora", "Park Kiely", "808 West Apartments", 'The Pierce', 'Fruitdale Station Apartments', 'Avalon at Cahill Park']));

  function initMap() {
    // Create a styles array to use with the map.
    // source:  https://snazzymaps.com/style/70/unsaturated-browns
    // creator: Simon Goellner
    var styles = [
        {
            "elementType": "geometry",
            "stylers": [
                {
                    "hue": "#ff4400"
                },
                {
                    "saturation": -68
                },
                {
                    "lightness": -4
                },
                {
                    "gamma": 0.72
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels.icon"
        },
        {
            "featureType": "landscape.man_made",
            "elementType": "geometry",
            "stylers": [
                {
                    "hue": "#0077ff"
                },
                {
                    "gamma": 3.1
                }
            ]
        },
        {
            "featureType": "water",
            "stylers": [
                {
                    "hue": "#00ccff"
                },
                {
                    "gamma": 0.44
                },
                {
                    "saturation": -33
                }
            ]
        },
        {
            "featureType": "poi.park",
            "stylers": [
                {
                    "hue": "#44ff00"
                },
                {
                    "saturation": -23
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "hue": "#007fff"
                },
                {
                    "gamma": 0.77
                },
                {
                    "saturation": 65
                },
                {
                    "lightness": 99
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "gamma": 0.11
                },
                {
                    "weight": 5.6
                },
                {
                    "saturation": 99
                },
                {
                    "hue": "#0091ff"
                },
                {
                    "lightness": -86
                }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
                {
                    "lightness": -48
                },
                {
                    "hue": "#ff5e00"
                },
                {
                    "gamma": 1.2
                },
                {
                    "saturation": -23
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "saturation": -64
                },
                {
                    "hue": "#ff9100"
                },
                {
                    "lightness": 16
                },
                {
                    "gamma": 0.47
                },
                {
                    "weight": 2.7
                }
            ]
        },
    ];

    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 37.3335, lng: -121.922},
      zoom: 13,
      styles: styles,
      mapTypeControl: false
    });

    var default_marker = new google.maps.Marker({
            map: map,
            position: location.position,
            title: location.title,
            URL: location.shortUrl,
            icon: 'https://ss1.4sqi.net/img/pin-squircle-blue-bd58a9a123ca8fb3a84f4ee889b6b781.png',
            animation: google.maps.Animation.DROP
    });

    location.default_marker = default_marker;

    default_marker.setVisible(true);

    //adds default_marker into markers array
    self.markers.push(default_marker);

    // this autocomplete is for use in the search within street entry box.
    var streetAutocomplete = new google.maps.places.Autocomplete(document.getElementById('street'));
    // This autocomplete is for use in the geocoder city entry box.
    var cityAutocomplete = new google.maps.places.Autocomplete(document.getElementById('city'));
    // Bias the boundaries within the map for the city entry box text.
    cityAutocomplete.bindTo('bounds', map);

    // Create a searchbox in order to execute a places search
    var searchBox = new google.maps.places.SearchBox(document.getElementById('places-search'));
    // Bias the searchbox to within the bounds of the map.
    searchBox.setBounds(map.getBounds());


    // These are the real estate listings that will be shown to the user.
    // Normally we'd have these in a database instead.
    var locations = [
      {title: 'Misora', location: {lat: 37.319926, lng: -121.946511}},
      {title: 'Park Kiely', location: {lat: 37.319817, lng: -121.976738}},
      {title: '808 West Apartments', location: {lat: 37.317033, lng: -121.841314}},
      {title: 'The Pierce', location: {lat: 37.327007, lng: -121.884473}},
      {title: 'Fruitdale Station Apartments', location: {lat: 37.309412, lng: -121.918435}},
      {title: 'Avalon at Cahill Park', location: {lat: 37.331571, lng: -121.905183}}
    ];

    var largeInfowindow = new google.maps.InfoWindow();

    // Style the markers a bit. This will be our listing marker icon.
    var defaultIcon = makeMarkerIcon('0091ff');

    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('FFFF24');

    var largeInfowindow = new google.maps.InfoWindow();
    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
      // Get the position from the location array.
      var position = locations[i].location;
      var title = locations[i].title;
      // Create a marker per location, and put into markers array.
      var marker = new google.maps.Marker({
        position: position,
        title: title,
        animation: google.maps.Animation.DROP,
        icon: defaultIcon,
        id: i
      });
      // Push the marker to our array of markers.
      markers.push(marker);
      // Create an onclick event to open the large infowindow at each marker.
      marker.addListener('click', function() {
        populateInfoWindow(this, largeInfowindow);
      });
      // Two event listeners - one for mouseover, one for mouseout,
      // to change the colors back and forth.
      marker.addListener('mouseover', function() {
        this.setIcon(highlightedIcon);
      });
      marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);
      });
    }

    document.getElementById('show-listings').addEventListener('click', showListings);
    document.getElementById('hide-listings').addEventListener('click', function() {
      hideMarkers(markers);
    });

    document.getElementById('zoom-to-area').addEventListener('click', function() {zoomToArea();
  });

    // Listen for the event fired when the user selects a prediction from the picklist and retrieves more details for that place.
    searchBox.addListener('places_changed', function() {
      searchBoxPlaces(this);
    });

    // Listen for the event fired when the user selects a prediction and clicks "go" for more details for that place.
    document.getElementById('go-places').addEventListener('click', textSearchPlaces);
  // This function takes the input value in the find street text input
  // locates it, and then zooms into that area.  This is so that the user can show all listings, then decide to focus on one area of the map. 
  function zoomToArea() {
    // Initialize the geocoder.
    var geocoder = new google.maps.Geocoder();
    // Get the address or place that the user entered.
    var street = document.getElementById('street').value;

    var city = document.getElementById('city').value;

    var state = document.getElementById('state').value;

    var address = street + ', ' + city + ', ' + state;

    // Make sure the street address and city user input isn't blank.
    if (street == '' || city == '') {
      window.alert('You must enter a street, city and state location.');
    } else {
      // Geocode the address/area entered to get the center.  Then, center the map on it and zoom in.
      geocoder.geocode(
      {address: address,
        componentRestrictions: {locality: 'San Jose'}
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          map.setCenter(results[0].geometry.location);
          map.setZoom(15);
        } else {
          window.alert('We counld not find that location - try entering a more' + ' specific place.');
        }
      });
    }
  }
  // This function populates the infowindow when the marker is clicked. We'll only allow
  // one infowindow which will open at the marker that is clicked, and populate based
  // on that markers position.
  function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      // Clear the infowindow content to give the streetview time to load.
      infowindow.setContent('');
      infowindow.marker = marker;
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
      var streetViewService = new google.maps.StreetViewService();
      var radius = 50;
      // In case the status is OK, which means the pano was found, compute the
      // position of the streetview image, then calculate the heading, then get a
      // panorama from that and set the options
      function getStreetView(data, status) {
        if (status == google.maps.StreetViewStatus.OK) {
          var nearStreetViewLocation = data.location.latLng;
          var heading = google.maps.geometry.spherical.computeHeading(
            nearStreetViewLocation, marker.position);
            infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
            var panoramaOptions = {
              position: nearStreetViewLocation,
              pov: {
                heading: heading,
                pitch: 30
              }
            };
          var panorama = new google.maps.StreetViewPanorama(
            document.getElementById('pano'), panoramaOptions);
        } else {
          infowindow.setContent('<div>' + marker.title + '</div>' +
            '<div>No Street View Found</div>');
        }
      }
      // Use streetview service to get the closest streetview image within
      // 50 meters of the markers position
      streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
      // Open the infowindow on the correct marker.
      infowindow.open(map, marker);
    }
  }

  // This function will loop through the markers array and display them all.
  function showListings() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
      bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
  }

  // This function will loop through the listings and hide them all.
  function hideMarkers(markers) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  }

  // This function takes in a COLOR, and then creates a new marker
  // icon of that color. The icon will be 21 px wide by 34 high, have an origin
  // of 0, 0 and be anchored at 10, 34).
  function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21,34));
    return markerImage;
  }

  // This function fires when the user selects a searchbox picklist item.
  // It will do a nearby search using the selected query string or place.
  function searchBoxPlaces(searchBox) {
    hideMarkers(placeMarkers);
    var places = searchBox.getPlaces();
    // For each place, get the icon, name and location.
    createMarkersForPlaces(places);
    if (places.length == 0) {
      window.alert('We did not find any places matching that search!');
    }
  }

  // This function firest when the user select "go" on the places search.
  // It will do a nearby search using the entered query string or place.
  function textSearchPlaces() {
    var bounds = map.getBounds();
    hideMarkers(placeMarkers);
    var placesService = new google.maps.places.PlacesService(map);
    placesService.textSearch({
      query: document.getElementById('places-search').value,
      bounds: bounds
    }, function(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        createMarkersForPlaces(results);
      }
    });
  }

  // This function creates markers for each place found in either places search.
  function createMarkersForPlaces(places) {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < places.length; i++) {
      var place = places[i];
      var icon = {
        url: place.icon,
        size: new google.maps.Size(35, 35),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(15, 34),
        scaledSize: new google.maps.Size(25, 25)
      };
      // Create a marker for each place.
      var marker = new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location,
        id: place.place_id
      });
      // Create a single infowindow to be used with the place details information
      // so that only one is open at once.
      var placeInfoWindow = new google.maps.InfoWindow();
      // If a marker is clicked, do a place details search on it in the next function.
      marker.addListener('click', function() {
        if (placeInfoWindow.marker == this) {
          console.log("This infowindow already is on this marker!");
        } else {
          getPlacesDetails(this, placeInfoWindow);
        }
      });
      placeMarkers.push(marker);
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    }
    map.fitBounds(bounds);
  }

// This is the PLACE DETAILS search - it's the most detailed so it's only
// executed when a marker is selected, indicating the user wants more
// details about that place.
function getPlacesDetails(marker, infowindow) {
  var service = new google.maps.places.PlacesService(map);
  service.getDetails({
    placeId: marker.id
  }, function(place, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      // Set the marker property on this infowindow so it isn't created again.
      infowindow.marker = marker;
      var innerHTML = '<div>';
      if (place.name) {
        innerHTML += '<strong>' + place.name + '</strong>';
      }
      if (place.formatted_address) {
        innerHTML += '<br>' + place.formatted_address;
      }
      if (place.formatted_phone_number) {
        innerHTML += '<br>' + place.formatted_phone_number;
      }
      if (place.opening_hours) {
        innerHTML += '<br><br><strong>Hours:</strong><br>' +
            place.opening_hours.weekday_text[0] + '<br>' +
            place.opening_hours.weekday_text[1] + '<br>' +
            place.opening_hours.weekday_text[2] + '<br>' +
            place.opening_hours.weekday_text[3] + '<br>' +
            place.opening_hours.weekday_text[4] + '<br>' +
            place.opening_hours.weekday_text[5] + '<br>' +
            place.opening_hours.weekday_text[6];
      }
      if (place.photos) {
        innerHTML += '<br><br><img src="' + place.photos[0].getUrl(
            {maxHeight: 100, maxWidth: 200}) + '">';
      }
      if (place.rating) {
        innerHTML += '<br><strong> Rating: </strong>' + place.rating;
      }
      if (place.price_level) {
        if (place.price_level == 1) {
        innerHTML += '<br><strong> Price Level: </strong>' + '$';
        }
        if (place.price_level == 2) {
        innerHTML += '<br><strong> Price Level: </strong>' + '$$';
        }
        if (place.price_level == 3) {
          innerHTML += '<br><strong> Price Level: </strong>' + '$$$';
        }
        if (place.price_level == 4) {
          innerHTML += '<br><strong> Price Level: </strong>' + '$$$$';
        }

      }
      innerHTML += '</div>';
      infowindow.setContent(innerHTML);
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
    }
  });
 }
}


function loadData() {

    var $body = $('body');
    // var $wikiElem = $('#wikipedia-links');
    // var $instagramHeaderElem = $('#instagram-header');
    // var $instagramElem = $('#rudr_instafeed');
    var $wuHeaderElem = $('#weather-underground-header');
    var $wuElem = $('#weather-underground-forecast');

    // clear out old data before new request
    // $wikiElem.text("");
    // $instagramElem.text("");
    $wuElem.text("");


    // load streetview
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var stateStr = $('#state').val();
    var address = streetStr + ', ' + cityStr + ', ' + stateStr;


    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';
    $body.append('<img class="bgimg" src = " ' + streetviewUrl + '">');


    // weather underground AJAX request goes here
    // append weather forecast for San Jose, CA to wuElem, weather-underground-forecast
    // display error messsage if we cannot get JSON
    var weatherundergroundUrl = "http://api.wunderground.com/api/65646c8c86b0eefe/conditions/q/" + stateStr  + "/" + cityStr + ".json";

    $.getJSON(weatherundergroundUrl, function(data) {  
      
      $wuHeaderElem.text('The current weather in ' + cityStr + ', ' + stateStr + ':');
      info = data.current_observation;

      $wuElem.append('<ul>' + info.weather + '<br>' + ('<img src= " ' + info.icon_url + '" alt="weather Icon">') + '</ul>');
      $wuElem.append('<ul>' + Math.round(info.temp_f) + '°F' + ' / ' + Math.round(info.temp_c) + '°C</ul>');
      $wuElem.append('<ul> Humidity: ' +  info.relative_humidity + '</ul>');
    }).error(function(e){
        $wuHeaderElem.text("Sorry, weather underground could not be loaded. Please try again.");
    });



    // // instagram images AJAX request
    // // source:  https://rudrastyh.com/api/instagram-with-pure-javascript.html
    // var token = '179587194.551f369.ce100fd77ea748c19d88f1c55fdecb64',
    // num_photos = 10, // maximum 20
    // container = document.getElementById( 'rudr_instafeed' ), // it is our <ul id="rudr_instafeed">
    // scrElement = document.createElement( 'script' );
 
    // window.mishaProcessResult = function( data ) {
    //     for(var x in data.data ){
    //         container.innerHTML += '<li><img src="' + data.data[x].images.low_resolution.url + '"></li>';
    //     }
    // };
 
    // scrElement.setAttribute( 'src', 'https://api.instagram.com/v1/users/self/media/recent?access_token=' + token + '&count=' + num_photos + '&callback=mishaProcessResult' );
    // document.body.appendChild( scrElement );


    
    // // Wikipedia AJAX request
    // var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';

    // var wikiRequestTimeout = setTimeout(function(){
    //     $wikiElem.text("failed to get wikipedia resources");
    // }, 8000);

    // $.ajax({
    //     url: wikiUrl,
    //     dataType: "jsonp",
    //     // jsonp: "callback",
    //     success: function(response) {
    //         var articleList = response[1];

    //         for (var i = 0; i < articleList.length; i++) {
    //             articleStr = articleList[i];
    //             var url = 'http://en.wikipedia.org/wiki/' + articleStr;
    //             $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
    //         }

    //         clearTimeout(wikiRequestTimeout);
    //     }
    // });
    // return false;

    // var defaultLocations = [
    //   {title: 'Misora', location: {lat: 37.319926, lng: -121.946511}},
    //   {title: 'Park Kiely', location: {lat: 37.319817, lng: -121.976738}},
    //   {title: '808 West Apartments', location: {lat: 37.317033, lng: -121.841314}},
    //   {title: 'The Pierce', location: {lat: 37.327007, lng: -121.884473}},
    //   {title: 'Fruitdale Station Apartments', location: {lat: 37.309412, lng: -121.918435}},
    //   {title: 'Avalon at Cahill Park', location: {lat: 37.331571, lng: -121.905183}}
    // ];

}


var openInfoWindow;

var defaultLocations = [
      {name: 'Misora-Apartments', position: {lat: 37.319926, lng: -121.946511}, id: "5920f1031de7652db3e0ed2f"},
      {name: 'Park Kiely Apartments', position: {lat: 37.319817, lng: -121.976738}, id: "4fbc0c03e4b0c3466b4f3e55"},
      {name: 'West Park Apartments', position: {lat: 37.300655, lng: -121.953355}, id: "4fa88798e4b0f380f2aa2182"},
      {name: 'The Pierce', position: {lat: 37.327007, lng: -121.884473},id: "58d1c4838ab03f3added7502"},
      {name: 'Fruitdale Station Apartments', position: {lat: 37.309412, lng: -121.918435}, id: "4b292153f964a520589924e3"},
      {name: 'Avalon at Cahill Park', position: {lat: 37.331571, lng: -121.905183}, id: "54063e27498ed430b363688e"}
    ];


function getContent(location){
    return ("successfully retrieved content!")
}


function NeighborhoodViewModel() {
    var self = this;
    self.markers = [];

    self.defaultLocations = ko.observableArray(defaultLocations);

    self.defaultLocations().forEach(function(location) {
        
        var default_marker = new google.maps.Marker({
            map: map,
            position: location.position,
            title: location.title,
            URL: location.shortUrl,
            icon: 'https://ss1.4sqi.net/img/pin-squircle-blue-bd58a9a123ca8fb3a84f4ee889b6b781.png',
            animation: google.maps.Animation.DROP
        });

        location.default_marker = default_marker;

        default_marker.setVisible(true);

        //adds default_marker into markers array
        self.markers.push(default_marker);

            var CLIENT_ID_Foursquare = '&client_id=VSGRHLGZSLZDC0H3KZVLZJCBZOQ4VBO5DZIEWEVKXGXMQ0SB';
            var CLIENT_SECRET_Foursquare = '&client_secret=LNCN2UO3VNFB0Y5C14CJTSELFPJ5QOLL3F41G1IWKAL2YI1U';

            // Foursquare API REQUEST
            $.ajax({
                type: "GET",
                dataType: 'json',
                cache: false,
                url: 'https://api.foursquare.com/v2/venues/' + location.id + CLIENT_ID_Foursquare + CLIENT_SECRET_Foursquare + '&v=20171115' + 'm=foursquare',
                async: true,
                success: function(data) {
                    console.log(data.response);
                    console.log(data.venue.name);
                    console.log(data.response.venue.location.formattedAddress);

                var infoWindow = new google.maps.InfoWindow({
                                content: getContent({title: data.response.venue.name,
                                formattedAddress: data.response.venue.location.formattedAddress
                                })

                });
                }

            });
    });

}
// var Pin = function Pin(map, name, lat, lon, text) {

//     var marker;
//     this.name = ko.observable(name);
//     this.lat = ko.observable(lat);
//     this.lon = ko.observable(lon); 
//     this.text = ko.observable(text);
    
//     marker = new google.maps.Marker({
//         position: new google.maps.LatLng(lat, lon),
//         animation: google.maps.Animation.DROP
//     });

//     this.isVisible = ko.observable(false);

//     this.isVisible.subscribe(function(currentState){
//         if(currentState) {
//             marker.setMap(map);
//         } else {
//             marker.setMap(null);
//         }
//     });
//     this.isVisible(true);
// };

// ko.utils.arrayFilter - filter the items using the filter text
// self.filteredItems = ko.computed(function(){
//     var search = self.query().toLowerCase();
        
//     return ko.utils.arrayFilter(self.pins(), function (pin){
//         var doesMatch = pin.name().toLowerCase().indexOf(search) >= 0;
        
//         pin.isVisible(doesMatch);

//         return doesMatch;
//     });
// });


$('#form-container').submit(loadData);

ko.applyBindings(NeighborhoodViewModel());
