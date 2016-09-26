document.addEventListener("DOMContentLoaded", initialize);

function initialize() {

    var timeOut = 1000;

    setTimeout(function() {
        var myLatLng = {lat: 49.85, lng: 24.0166666667};

        var map = new google.maps.Map(document.querySelector('.map-container'), {
            zoom: 13,
            center: myLatLng,
            scrollwheel: false,
            mapTypeId: 'roadmap',
            styles: [
                {
                    "featureType": "water",
                    "stylers": [
                        {"color": "#193341"}
                    ]
                }, {
                    "featureType": "road.arterial",
                    "elementType": "geometry",
                    "stylers": [
                        {"color": "#406D80"},
                        {"visibility": "on"}
                    ]
                }, {
                    "featureType": "road.highway",
                    "stylers": [
                        {"color": "#194A57"}
                    ]
                }, {
                    "featureType": "road.local",
                    "stylers": [
                        {"color": "#406D80"}
                    ]
                }, {
                    "featureType": "administrative",
                    "elementType": "geometry",
                    "stylers": [
                        {"color": "#2C5A71"}
                    ]
                }, {
                    "featureType": "landscape",
                    "stylers": [
                        {"color": "#2C5A71"}
                    ]
                }, {
                    "featureType": "landscape.man_made",
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {"color": "#2C5A71"},
                        {"visibility": "off"}
                    ]
                }, {
                    "featureType": "poi",
                    "stylers": [
                        {"visibility": "off"}
                    ]
                }, {
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {"visibility": "on"},
                        {"color": "#ffffff"}
                    ]
                }
            ]
        });

        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title: 'Main office in Lviv'
        });

    }, timeOut);
}
