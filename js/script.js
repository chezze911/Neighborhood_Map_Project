

  var defaultLocations = [
      {title: 'Misora', location: {lat: 37.319926, lng: -121.946511}},
      {title: 'Park Kiely', location: {lat: 37.319817, lng: -121.976738}},
      {title: '808 West Apartments', location: {lat: 37.317033, lng: -121.841314}},
      {title: 'The Pierce', location: {lat: 37.327007, lng: -121.884473}},
      {title: 'Fruitdale Station Apartments', location: {lat: 37.309412, lng: -121.918435}},
      {title: 'Avalon at Cahill Park', location: {lat: 37.331571, lng: -121.905183}}
    ];

  var map;
var largeInfowindow
  // Create a new blank array for all the listing markers.
  var markers = [];

  // Create placemarkers array to use in multiple functions to have control over the number of places that show.
  var placeMarkers = [];


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


    self.isVisible = ko.observable(false);

    self.isVisible.subscribe(function(currentState) {
        if(currentState) {
            default_marker.setMap(map);
        } else {
            default_marker.setMap(null);
        }
    });
    self.isVisible(true);


    var largeInfowindow = new google.maps.InfoWindow();

    // Style the markers a bit. This will be our listing marker icon.
    var defaultIcon = makeMarkerIcon('0091ff');

    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('FFFF24');

   largeInfowindow = new google.maps.InfoWindow();
    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < defaultLocations.length; i++) { console.log("here")
      // Get the position from the location array.
      var position = defaultLocations[i].position;
      console.log( defaultLocations[i])
      var title = defaultLocations[i].title;
      // Create a marker per location, and put into markers array.
      var marker = new google.maps.Marker({
        position: position,
        title: name,
        animation: google.maps.Animation.DROP,
        icon: defaultIcon,
        id: i,
        map: map
      });
      // Push the marker to our array of markers.
      markers.push(marker);
      defaultLocations[i].marker = marker;
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
    ko.applyBindings(new NeighborhoodViewModel());

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
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function(){
        marker.setAnimation(null);
      }, 800);
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
    // var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var stateStr = $('#state').val();
    // var cityStr = 'San Jose';
    // var stateStr = 'CA';
    // var address = streetStr + ', ' + cityStr + ', ' + stateStr;


    // var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';
    // $body.append('<img class="bgimg" src = " ' + streetviewUrl + '">');


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

}


var openInfoWindow;

var defaultLocations = [
      {name: 'Misora Apartments', position: {lat: 37.319926, lng: -121.946511}, id: "5920f1031de7652db3e0ed2f"},
      {name: 'Park Kiely Apartments', position: {lat: 37.319817, lng: -121.976738}, id: "4fbc0c03e4b0c3466b4f3e55"},
      {name: 'West Park Apartments', position: {lat: 37.300655, lng: -121.953355}, id: "4fa88798e4b0f380f2aa2182"},
      {name: 'The Pierce', position: {lat: 37.327007, lng: -121.884473},id: "58d1c4838ab03f3added7502"},
      {name: 'Fruitdale Station Apartments', position: {lat: 37.309412, lng: -121.918435}, id: "4b292153f964a520589924e3"},
      {name: 'Avalon at Cahill Park', position: {lat: 37.331571, lng: -121.905183}, id: "54063e27498ed430b363688e"}
    ];


function NeighborhoodViewModel() {
    var self = this;
    self.markers = [];
    self.filter = ko.observable("");
    // trach user input
    self.userInput = ko.observable("");
    self.search = ko.observable("");
    // markers array based on search
    self.visible = ko.observable("");
    self.filterItems = ko.observableArray(defaultLocations);
    console.log(self.filterItems())
    self.bounce = function(location) {
      console.log(location)
      largeInfowindow.open(map, location.marker)
    }
    // Foursquare App Info
    var CLIENT_ID = 'VSGRHLGZSLZDC0H3KZVLZJCBZOQ4VBO5DZIEWEVKXGXMQ0SB',
        CLIENT_SECRET = 'LNCN2UO3VNFB0Y5C14CJTSELFPJ5QOLL3F41G1IWKAL2YI1U'

    }
    
    self.filterPins = function () {
        //Set all markers and places to not be visible
        var searchInput = self.userInput().toLowerCase();
        // close current infowindows when search term entered
        infowindow.close();
        self.visible.removeAll();

        self.filterItems().forEach(function (location) {
            self.visible.push(location)

            location.setVisible(false);
                // If user input is included in the name, set marker to visible
                if(location.name().toLowerCase().indexOf(searchInput) !== -1) {
                    self.visible.push(location);
                }
        });

        self.visible().forEach(function (location) {
            location.setVisible(true);
        });
    };


// //filter the items using the filter text
// self.filteredItems = ko.computed(function() {
//     var filter = self.filter().toLowerCase();

//     var stringStartsWith = function (string, startsWith) {          
//         string = string || "";
//         if (startsWith.length > string.length)
//             return false;
//         return string.substring(0, startsWith.length) === startsWith;
//     };

//     if (!filter) {
//         return self.filterItems();
//     } else {
//         return ko.utils.arrayFilter(self.filterItems(), function(item) {
//             return ko.utils.stringStartsWith(item.name().toLowerCase(), filter);
//         });
//     }
// }, NeighborHoodViewModel);


  /*  
  defaultLocations().forEach(function(location) {
        
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
*/
// }
// // ko.utils.arrayFilter - filter the items using the filter text
//     NeighborhoodViewModel.filteredItems = ko.dependentObservable(function(){
//         var self = this;
//         var filter = self.filteredItems.toLowerCase();
//         if(!filter) {
//             return self.filteredItems();
//         } else {
//             return ko.utils.arrayFilter(self.filteredItems(), function(filter) {
//                 return ko.utils.stringStartsWith(filter.name().toLowerCase(), filter);
//             });
//         }
//     }, NeighborhoodViewModel);

// var defaultLocations = [
//       {name: 'Misora Apartments', position: {lat: 37.319926, lng: -121.946511}, id: "5920f1031de7652db3e0ed2f"},
//       {name: 'Park Kiely Apartments', position: {lat: 37.319817, lng: -121.976738}, id: "4fbc0c03e4b0c3466b4f3e55"},
//       {name: 'West Park Apartments', position: {lat: 37.300655, lng: -121.953355}, id: "4fa88798e4b0f380f2aa2182"},
//       {name: 'The Pierce', position: {lat: 37.327007, lng: -121.884473},id: "58d1c4838ab03f3added7502"},
//       {name: 'Fruitdale Station Apartments', position: {lat: 37.309412, lng: -121.918435}, id: "4b292153f964a520589924e3"},
//       {name: 'Avalon at Cahill Park', position: {lat: 37.331571, lng: -121.905183}, id: "54063e27498ed430b363688e"}
//     ];


// pin = ko.observableArray([
//               new Pin(map, name: "Misora Apartments", position: {lat: 37.319926, lng: -121.946511}),
//               new Pin(map, name: 'Park Kiely Apartments', position: {lat: 37.319817, lng: -121.976738}),
//               new Pin(map, name: 'West Park Apartments', position: {lat: 37.300655, lng: -121.953355}),
//               new Pin(map, name: 'The Pierce', position: {lat: 37.327007, lng: -121.884473}),
//               new Pin(map, name: 'Fruitdale Station Apartments', position: {lat: 37.309412, lng: -121.918435}),
//               new Pin(map, name: 'Avalon at Cahill Park', position: {lat: 37.331571, lng: -121.905183})
//         ]);

// self.filter = ko.observable("");

// give access to map object, so that it can register and de-register itself
// var Pin = function Pin(map, name, position) {
    
//     var self = this;
//     var marker;

//     // self.pins = ko.observableArray([
//     //           {new Pin(map, name: "Misora Apartments", position: {lat: 37.319926, lng: -121.946511})},
//     //           {new Pin(map, name: 'Park Kiely Apartments', position: {lat: 37.319817, lng: -121.976738})},
//     //           {new Pin(map, name: 'West Park Apartments', position: {lat: 37.300655, lng: -121.953355})},
//     //           {new Pin(map, name: 'The Pierce', position: {lat: 37.327007, lng: -121.884473})},
//     //           {new Pin(map, name: 'Fruitdale Station Apartments', position: {lat: 37.309412, lng: -121.918435})},
//     //           {new Pin(map, name: 'Avalon at Cahill Park', position: {lat: 37.331571, lng: -121.905183})}
//     //     ]);

//     self.name = ko.observable(name);
//     self.position = ko.observable(position);

//     marker = new google.maps.Marker({
//         position: position,
//         animation: google.maps.Animation.DROP
//     });

//     self.isVisible = ko.observable(false);

//     self.isVisible.subscribe(function(currentState) {
//         if(currentState) {
//             marker.setMap(map);
//         } else {
//             marker.setMap(null);
//         }
//     });
//     self.isVisible(true);
// }

// self.filterItems = ko.computed(function () {
//     var search = self.filter().toLowerCase();

//     return ko.utils.arrayFilter(self.filterItems, function(defaultLocations) {
//         var doesMatch = defaultLocations.name().toLowerCase().indexOf(search) >= 0;

//         defaultLocations.isVisible(doesMatch);

//         return doesMatch;
//     });
// });

$("form-container").submit(loadData);


