 'use strict';
var map;
/* Declaring Locations*/
var locations = [
    {
        title: "Coorg(Madikeri)",
        wikipediaName: "Madikeri",
        location: {lat: 12.424421, lng: 75.738186},
        visible: ko.observable(true),
        id: "loc0",
        display: true
    },{
        title: "Gokarna",
        wikipediaName: "Gokarna, Karnataka",
        location: {lat: 14.543546, lng: 74.316536},
        visible: ko.observable(true),
        id: "loc1",
        display: true
    },{
        title: "Hampi",
        wikipediaName: "Hampi",
        location: {lat: 15.335013, lng: 76.460024},
        visible: ko.observable(true),
        id: "loc2",
        display: true
    },{
        title: "Jog Falls",
        wikipediaName: "Jog Falls",
        location: {lat: 14.204720, lng: 74.784214},
        visible: ko.observable(true),
        id: "loc3",
        display: true
    },{
        title: "Amba Vilas Palace",
        wikipediaName: "Mysore Palace",
        location: {lat: 12.305135, lng: 76.655148},
        visible: ko.observable(true),
        id: "loc4",
        display: true
    },{
        title: "Kudremukha",
        wikipediaName: "Kudremukh",
        location: {lat: 13.224148, lng: 75.252453},
        visible: ko.observable(true),
        id: "loc5",
        display: true
    },{
        title: "Mullayanagiri",
        wikipediaName: "Mullayanagiri",
        location: {lat: 13.390940, lng: 75.721385},
        visible: ko.observable(true),
        id: "loc6",
        display: true
    }
];

// google maps error function
var mapTimer = setTimeout(function() {
    $('.map-error').html('Map ERROR!');
}, 5000);

/* Initializing map*/
function initMap() {
    var styles= [
        {
          "featureType": "all",
          "elementType": "labels.text.fill",
          "stylers": [
            {"color": "#ffffff"}
            ]
        },{
          "featureType": "all",
          "elementType": "labels.text.stroke",
          "stylers": [
            {"color": "#000000"},
            {"lightness": 13}
            ]
        },{
          "featureType": "administrative",
          "elementType": "geometry.fill",
          "stylers": [
            {"color": "#000000"}
            ]
        },{
          "featureType": "administrative",
          "elementType": "geometry.stroke",
          "stylers": [
            {"color": "#144b53"},
            {"lightness": 14},
            {"weight": 1.4}
            ]
        },{
          "featureType": "landscape",
          "elementType": "all",
          "stylers": [
            {"color": "#08304b"}
            ]
        },{
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
            {"color": "#0c4152"},
            {"lightness": 5}
            ]
        },{
          "featureType": "road.highway",
          "elementType": "geometry.fill",
          "stylers": [
            {"color": "#FF0000"}
            ]
        },{
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
            {"color": "#008000"},
            {"lightness": 25}
            ]
        },{
          "featureType": "road.arterial",
          "elementType": "geometry.fill",
          "stylers": [
            {"color": " #FFFFFF"}
            ]
        },{
          "featureType": "road.arterial",
          "elementType": "geometry.stroke",
          "stylers": [
            {"color": "#0b3d51"},
            {"lightness": 16}
            ]
        },{
          "featureType": "road.local",
          "elementType": "geometry",
          "stylers": [
            {"color": "#008000"}
            ]
        },{
          "featureType": "transit",
          "elementType": "all",
          "stylers": [
            {"color": "#146474"}
            ]
        },{
          "featureType": "water",
          "elementType": "all",
          "stylers": [
            {"color": "#021019"}
            ]
        }
    ];
    clearTimeout(mapTimer);
    var bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(11.487763, 73.778687), //SW
        new google.maps.LatLng(17.385044, 78.486671) //NE
    );
    map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: 14.466344, lng: 75.923840},
        zoom:10,
        styles: styles
    });
    map.fitBounds(bounds);

    displayMarkers(locations);
    setMarker();

    $(window).resize(function(){
        map.fitBounds(bounds);
    });
}

/* Controlling the markers based on the 'display' property */
function setMarker() {
    for (var i = 0; i < locations.length; i++) {
        if(locations[i].display === true) {
            locations[i].marker.setMap(map);
        } else {
            locations[i].marker.setMap(null);
        }
    }
}
// clearTimeout(mapTimer);
/* Creating markers */
function displayMarkers() {
    var image = 'img/mark.png';
    for (var i = 0; i < locations.length; i++) {
        locations[i].marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i].location),
            map: map,
            animation: google.maps.Animation.DROP,
            title: locations.title,
            icon:image
        });

        var wikiName = locations[i].wikipediaName;
        var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' +
         wikiName + '&format=json&callback=wikiCallback';

        (function(i){
            var wikiTimer = setTimeout(function() {
                $('.wiki-error').html('Wikipedia ERROR!');
            }, 7000);

            $.ajax({
                url: wikiUrl,
                dataType: "jsonp"
            }).done(function(response){
                var article = response[2][0];
                    locations[i].contentString ='<strong>'+ locations[i].title + '</strong><p>' + article +'</p>';
                    clearTimeout(wikiTimer);
            });
        })(i);

        var largeInfowindow = new google.maps.InfoWindow({});

        new google.maps.event.addListener(locations[i].marker, 'click',
            (function(place, i) { return function() {
               place.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    place.setAnimation(null);
                }, 1300);
                largeInfowindow.setContent(locations[i].contentString);
                largeInfowindow.open(map,this);
                map.setZoom(8);
            };
        })(locations[i].marker, i));

        /* info window access from listings*/
        var searchNav = $('#loc' + i);
        searchNav.click((function(place, i) {
            return function() {
                place.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    place.setAnimation(null);
                }, 1300);
                largeInfowindow.setContent(locations[i].contentString);
                largeInfowindow.open(map,place);
                map.setZoom(8);
            };
        })(locations[i].marker, i));
    }
}

/* List customisation */
function listToggle() {
    $(this).toggleClass("toggled");
    $( "#listing" ).toggle( "fast", function() {
    });
}

/* View model */
function viewModel() {
    var self = this;
    this.locationSearch = ko.observable('');
    ko.computed(function() {
        var search = self.locationSearch().toLowerCase();
        return ko.utils.arrayFilter(locations, function(loc) {
            if (loc.title.toLowerCase().indexOf(search) >= 0) {
                loc.display = true;
                return loc.visible(true);
            } else {
                loc.display = false;
                setMarker();
                return loc.visible(false);
            }
        });
    });
};

// Activating knockout
ko.applyBindings(new viewModel());