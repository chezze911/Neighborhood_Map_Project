
  // Listen for form submit
  document.getElementById("add-location-form").addEventListener('submit', submitForm);

  function submitForm(e){
    e.preventDefault();

    console.log(123);
  }
  var map;

  // Create a new blank array for all the listing markers.
  var markers = [];


  var defaultLocations = [
      {name: 'Pho Y #1', position: {lat: 37.305973, lng: -121.812203}, id: "4ac8f48ff964a52092bd20e3"},
      {name: 'Khanhs', position: {lat: 37.321959, lng: -121.950478}, id: "4a4149d1f964a5200aa51fe3"},
      {name: 'Vung Tau Restaurant', position: {lat: 37.341639, lng: -121.879504}, id: "4aabfe9df964a520735b20e3"},
      {name: 'Huong Lan Sandwich', position: {lat: 37.321542, lng: -121.827426},id: "4b37b9f3f964a520174525e3"},
      {name: 'Gio Cha Duc Huong Sandwich', position: {lat: 37.331328, lng: -121.855022}, id: "53b739f0498e1b9ab96408aa"},
      {name: 'Bun Bo Hue An Nam', position: {lat: 37.328845, lng: -121.858199}, id: "4b2d9bdff964a52081d924e3"}
    ];

  function getContent(data) {
    var contentString = ('<div>' + marker.title + '</div>');
    // build the content string
    return contentString;
}

  menu.addEventListener('click', function(e) {
  drawer.classList.toggle('open');
  e.stopPropagation();
});

//infoWindow.setContent(getContent(myFourSquareData));


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
      center: {lat: 37.335187, lng: -121.881072},
      zoom: 13,
      styles: styles,
      mapTypeControl: false
    });


    var default_marker = new google.maps.Marker({
            map: map,
            position: location.position,
            title: location.name,
            animation: google.maps.Animation.DROP
    });

    location.default_marker = default_marker;

    default_marker.setVisible(true);

    //adds default_marker into markers array
    self.markers.push(default_marker);


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
      var title = defaultLocations[i].name;
      // Create a marker per location, and put into markers array.
      var marker = new google.maps.Marker({
        position: position,
        title: title,
        animation: google.maps.Animation.DROP,
        icon: defaultIcon,
        id: i,
        foursquareID: defaultLocations[i].id,
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
    ko.applyBindings(new viewModel());

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

      var CLIENT_ID = 'VSGRHLGZSLZDC0H3KZVLZJCBZOQ4VBO5DZIEWEVKXGXMQ0SB';
      var CLIENT_SECRET = 'LNCN2UO3VNFB0Y5C14CJTSELFPJ5QOLL3F41G1IWKAL2YI1U';
      var url = 'https://api.foursquare.com/v2/venues/'
      var version = '20130815';

      var foursquareID = defaultLocations[marker.id].id;
      
      // Foursquare API REQUEST
      $.ajax({
          url: url + foursquareID,
          type: "GET",
          dataType: 'json',
          data: {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            // near: "San Jose",
            v: version,
            //query: "donuts",
          },
          async: true,

          success: function(data) {

              // console.log(data.response);
              // console.log("name: ", data.response.venue.name); // logs venue's name to the console

              var myFoursquareData = ('<div>' + data.response.venue.name + 
                '<div>' + 'Address: ' + data.response.venue.location.address + '</div>' +
                '<div>' + 'Phone: ' + data.response.venue.contact.formattedPhone + '</div>' +
                '<div>' + 'url: ' + '<a href ="' + data.response.venue.url + '"">Homepage</a>' + '</div>');

              marker.setAnimation(google.maps.Animation.BOUNCE);
              setTimeout(function(){
                marker.setAnimation(null);
              }, 800);
              infowindow.setContent(myFoursquareData);
                // Open the infowindow on the correct marker.
                infowindow.open(map, marker);
              }
            }) 
            error: {
                  infowindow.setContent('<div>' + marker.title + '</div>' + '<div>Error:  No Foursquare Data Returned</div>');
                  }
              }
      };

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


function viewModel() {

  var self = this;
      self.markers = [];
      self.filter = ko.observable("");
      // track user input
      self.doesMatch = ko.observable("");
      self.filterItems = ko.observableArray(defaultLocations);
      
      //console.log(self.filterItems())
      self.bounce = function(location) {
        console.log(location)
        // largeInfowindow.open(map, location.marker)
        // allows a single list location to be clicked and triggered on the map 
        google.maps.event.trigger(location.marker, "click")
      }

      //ko.utils.arrayFilter - filter the items using the filter text
      self.filterSearchItems = ko.computed(function(){
          
          return ko.utils.arrayFilter(self.filterItems(), function (location){
              
              var name = location.name.toLowerCase();

              var doesMatch = name.indexOf(self.filter().toLowerCase());
              
              console.log(name, doesMatch);

              if (doesMatch == -1) {
                location.marker.setVisible(false);
              } else {
                location.marker.setVisible(true);
              }
              return doesMatch >=0;

          });
      });
}


function loadData() {

    var $body = $('body');
    var $wuHeaderElem = $('#weather-underground-header');
    var $wuElem = $('#weather-underground-forecast');

    // clear out old data before new request
    $wuElem.text("");

    // load streetview
    // var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var stateStr = $('#state').val();
    // var cityStr = 'San Jose';
    // var stateStr = 'CA';
    // var address = streetStr + ', ' + cityStr + ', ' + stateStr;

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


$("form-container").submit(loadData);


