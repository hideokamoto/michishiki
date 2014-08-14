var Map = {};
Map.map = null;
Map.markers = null;

$(document).on('pageshow', '#map', function() {
    Map.initMap();
});

Map.initMap = function() {
    Map.markers = [];

    $('#map-canvas').css('height', 500);
    Map.map = Map.createMap('map-canvas', 34.87728, 135.576798); // kutc

    utils.getCurrentLocation().done(function(location) {
	var pos = new google.maps.LatLng(location.latitude,
					 location.longitude);

	Map.currentLocation = Map.createMarker(Map.map, 'Current location',
					       location.latitude, location.longitude, false);
    });

    Map.infoWindow = new google.maps.InfoWindow;

    utils.fetchPosts().done(function(json) {
	for (var i = 0; i < json.length; i++) {
	    var marker = Map.createMarker(Map.map, json[i].title,
					  json[i].latitude, json[i].longitude, false);
	    marker.data = json[i];
	    Map.markers.push(marker);

	    google.maps.event.addListener(marker, 'click', function() {
		var content = Map.jsonToContent(this.data);
		Map.infoWindow.setContent(content);
		Map.infoWindow.open(Map.map, this);
	    });
	}
    });
};

Map.createMap = function(id, lat, lng) {
    var mapOptions = {
	center: new google.maps.LatLng(lat, lng),
	zoom: 8,
	mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById(id), mapOptions);
    return map;
};

Map.createMarker = function(map, title, lat, lng, draggable) {
    var marker = new google.maps.Marker({
	position: new google.maps.LatLng(lat, lng),
	map: map,
	title : title,
	draggable: draggable
    });
    return marker;
};

Map.jsonToContent = function(json) {
    var title = json.title;
    var created_at = json.created_at;
    var posted_by = json.posted_by;
    var comment = json.comment;

    var content =
	    '<div>' +
	    '<h1>' + title + '</h1>' +
	    '<h2>' + created_at + '</h2>' +
	    '<h2>' + posted_by + '</h2>' +
	    '<p>' + comment + '</p>' +
	    '</div>';

    return content;
};