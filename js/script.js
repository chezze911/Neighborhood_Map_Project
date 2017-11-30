  
// Initialize Firebase
var config = {
    apiKey: "AIzaSyAsrsHacspv__vIaNw-om-plcowHHjZz4w",
    authDomain: "neighborhoodmapprojec.firebaseapp.com",
    databaseURL: "https://neighborhoodmapprojec.firebaseio.com",
    projectId: "neighborhoodmapprojec",
    storageBucket: "neighborhoodmapprojec.appspot.com",
    messagingSenderId: "22228876644"
};
firebase.initializeApp(config);

// Reference messages collection
var messagesRef = firebase.database().ref('messages');

// Listen for form submit
document.getElementById("add-location-form");


// Save message to firebase and push to ko observable array
function saveMessage(name, position, foursquare_ID) {
    var newMessageRef = messagesRef.push();

    newMessageRef.set({
        name: name,
        position: position,
        foursquare_ID: foursquare_ID
    });
}



var map;

// Create a new blank array for all the listing markers.
var markers = [];



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
        center: { lat: 37.335187, lng: -121.881072 },
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
    for (var i = 0; i < defaultLocations.length; i++) {
        /*jshint loopfunc: true */
        // Get the position from the location array.
        var position = defaultLocations[i].position;
        // console.log( defaultLocations[i])
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
        marker.addListener('click', function () {
            populateInfoWindow(this, largeInfowindow);
            map.panTo(marker.getPosition());


        });
        // Two event listeners - one for mouseover, one for mouseout,
        // to change the colors back and forth.
        marker.addListener('mouseover', function () {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function () {
            this.setIcon(defaultIcon);
        });

    }
    ko.applyBindings(new ViewModel());

}

mapError = function (msg, url, lineNo, columnNo, error) {
            // Create message and set message error equal to a string
            var msg_error = prompt('mapError Message');
            // Access string's toLowerCase.
            msg = msg_error.toLowerCase();
            var substring = "script error";
            if (msg.indexOf(substring) > -1) {
                alert('Script Error: See Browser Console for Detail');
            } else {
                var message = [
                    'Message: ' + msg,
                    'URL: ' + url,
                    'Line: ' + lineNo,
                    'Column: ' + columnNo,
                    'Error object: ' + JSON.stringify(error)
                ].join(' - ');

                alert(message);
            }

            return false;
        };


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
        infowindow.addListener('closeclick', function () {
            infowindow.marker = null;
        });

        var CLIENT_ID = 'VSGRHLGZSLZDC0H3KZVLZJCBZOQ4VBO5DZIEWEVKXGXMQ0SB';
        var CLIENT_SECRET = 'LNCN2UO3VNFB0Y5C14CJTSELFPJ5QOLL3F41G1IWKAL2YI1U';
        var url = 'https://api.foursquare.com/v2/venues/';
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
                v: version,
            },
            async: true,

            success: function (data) {

                console.log(data.response);

                var myFoursquareData = ('<div>' + data.response.venue.name +
                    '<div>' + 'Address: ' + data.response.venue.location.address + '</div>' +
                    '<div>' + 'Phone: ' + data.response.venue.contact.formattedPhone + '</div>' +
                    '<div>' + 'Foursquare Url: ' + '<a href ="' + data.response.venue.canonicalUrl + '"">For more details</a>' + '</div>' +
                    '<div>' + 'Rating: ' + data.response.venue.rating + '/10' + '</div>');

                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function () {
                    marker.setAnimation(null);
                }, 800);
                infowindow.setContent(myFoursquareData);
                // Open the infowindow on the correct marker.
                infowindow.open(map, marker);
            }
        });
        error: {
            infowindow.setContent('<div>' + marker.title + '</div>' + '<div>Error:  No Foursquare Data Returned</div>');
            // open the infowindow to show error warning to the user
            infowindow.open(map, marker);
        }
    }
}

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}


function ViewModel() {

    var self = this;
    self.markers = [];
    self.filter = ko.observable("");
    // track user input
    self.doesMatch = ko.observable("");
    self.filterItems = ko.observableArray(defaultLocations);
    self.menuIconClick = function(){
        $('#drawer').toggle('open');

        $('#map').toggle('open');
    };

    self.name = ko.observable("");
    self.position = ko.observable("");
    self.foursquare_ID = ko.observable("");
    self.addLocationOnSubmit = function() 
    {

        var valueEntered = JSON.stringify(
          {
              name: self.name(), 
              position: self.position(),
              foursquare_ID: self.foursquare_ID()
          });
          if(valueEntered) {
            alert("You entered: " + valueEntered);
          }
          else {
            alert("Please enter text.");
          }

          // Save message
          saveMessage(name, position, foursquare_ID);

          // Show alert
          document.querySelector('.alert').style.display = 'block';

          // Hide alert after 3 seconds
          setTimeout(function () 
          {
              document.querySelector('.alert').style.display = 'none';
          }, 3000);

          // Clears input fields after user submits favorite location data
          this.name('');
          this.position('');
          this.foursquare_ID('');

    };


    self.bounce = function (location) {
        // allows a single list location to be clicked and triggered on the map
        google.maps.event.trigger(location.marker, "click");
    };


    //ko.utils.arrayFilter - filter the items using the filter text
    self.filterSearchItems = ko.computed(function () {

        return ko.utils.arrayFilter(self.filterItems(), function (location) {

            var name = location.name.toLowerCase();

            var doesMatch = name.indexOf(self.filter().toLowerCase());


            if (doesMatch == -1) {
                location.marker.setVisible(false);
            } else {
                location.marker.setVisible(true);
            }
            return doesMatch >= 0;

        });
    });
}

