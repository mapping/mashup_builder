/**
 * Google Maps Renderer Package
 *  
 */

NORMAL_MAP = 'Normal';
HYBRID_MAP = 'Hibrid';
SATELITE_TYPE_MAP = 'Satellite';

(function() {

var google = new mb.UnitActionPackage('Renderer.GoogleMaps', {
  label : 'Google Maps'
});


google.register(new mb.RenderingUnitAction({

  type : 'GoogleMapsLocator',
  label : 'Google Maps Locator',
  description : 'Center a map in a point or location in Google Maps',
  iconCls : 'gmaps-uaction',
  inputs : [
    { name : 'placeName',
      label : 'Place Name',
      type : 'String' },
    { name : 'latitude',
      label : 'Latitude',
      type : 'Double' },
    { name : 'longitude',
      label : 'Longitude',
      type : 'Double' },
    { name : 'zoom',
      label : 'Zoom',
      type : 'Integer' },
    { name : 'width',
      label : 'Width',
      type : 'Integer' },
    { name : 'height',
      label : 'Height',
      type : 'Integer' },
    { name : 'zoomController',
      label : 'Zoom Controller',
      type : 'String',
      formElement : "CHECK_BOX" },
    { name : 'mapTypeController',
      label : 'Map Type Controller',
      type : 'String',
      formElement : "CHECK_BOX" },
    { name : 'mapType',
      label : 'Map type',
      type : 'String', 
      options : [NORMAL_MAP, HYBRID_MAP, SATELITE_TYPE_MAP] },
    { name : 'apiKey',
      label : 'API Key',
      type : 'String' }
  ],

  render : function(params, el) {

    var placeName      = params['placeName'] || '';
    var placeLocationX = params['longitude'] || '';
    var placeLocationY = params['latitude']  || '';
    
    if(placeName=='' && (placeLocationX=='' && placeLocationY==''))
      return;

    var zoom = params['zoom'] || 13;

    var width  = params['width']  || 500;
    var height = params['height'] || 500;
    
    var apiKey = params['apiKey'] || 'ABQIAAAAQLVYVvhTjXRPtKDa9AsPlhQs1SMlRZa-qyzdhC9kofgBeB67sRRcX48ZCyilXhFK6qqej_uY3YV6AA';
    
    var mapType = params['mapType'] || NORMAL_MAP;
    
    var mapTypeController = false;
    mapTypeController = params['mapTypeController'] || false;
    if(mapTypeController == 'true')
      mapTypeController = true;
  
    var zoomController = false;
    zoomController = params['zoomController'] || false;
    if(zoomController == 'true')
      zoomController = true;

    var iframe = mb.dom.createElement({
      tagName : 'iframe',
      width : width,
      height : height,
      frameBorder : 0,
      allowTransparency : true,
      scrolling : 'no'
    });
    el.appendChild(iframe);
    if (iframe.contentWindow) {
      var doc = iframe.contentWindow.document;
      doc.open();
      if(placeName)
        renderMapPlaceName(doc, placeName, width, height, zoom, zoomController, mapTypeController, mapType, apiKey); 
      else
        renderMapPlaceLocation(doc, placeLocationX, placeLocationY, width, height, zoom, zoomController, mapTypeController, mapType, apiKey); 
      doc.close(); 
    }
  }

}))

function renderMapPlaceName(doc, placeName, width, height, zoom, mapTypeController, zoomController, mapType, apiKey) {

  doc.write([
'<html>',
'  <head>',
'    <meta http-equiv="content-type" content="text/html; charset=utf-8"/>',
'    <script src="http://maps.google.com/maps?file=api&amp;v=2&amp;key='+apiKey+'" type="text/javascript"></script>',
'    <script type="text/javascript">',
'    function initialize() {',
'      if (GBrowserIsCompatible()) {',
'        map = new GMap2(document.getElementById("map_canvas"));',
setMapType(mapType),
addZoomMapController(zoomController),
addTypeMapController(mapTypeController),
'        geocoder = new GClientGeocoder();',
'        showAddress("'+placeName+'");',
'      }',
'    }',
'    function showAddress(address) {',
'      if (geocoder) {',
'        geocoder.getLatLng(',
'          address,',
'          function(point) {',
'            if (!point) {',
'              alert(address + " not found");',
'            } else {',
'              map.setCenter(point, '+zoom+');',
'            }',
'          }',
'        );',
'      }',
'    }',
'    </script>',
'  </head>',
'  <body onload="initialize()" onunload="GUnload()">',
'    <div id="map_canvas" style="width: '+width+'px; height: '+height+'px"></div>',
'  </body>',
'</html>'
].join('\n'));

}

function renderMapPlaceLocation(doc, placeLocationX, placeLocationY, width, height, zoom, mapTypeController, zoomController, mapType, apiKey) {
  
  doc.write([
'<html>',
'  <head>',
'    <meta http-equiv="content-type" content="text/html; charset=utf-8"/>',
'    <script src="http://maps.google.com/maps?file=api&amp;v=2&amp;key='+apiKey+'" type="text/javascript"></script>',
'    <script type="text/javascript">',
'     function initialize() {',
'      if (GBrowserIsCompatible()) {',
'        var map = new GMap2(document.getElementById("map_canvas"));',
setMapType(mapType),
addZoomMapController(zoomController),
addTypeMapController(mapTypeController),
'        map.setCenter(new GLatLng('+placeLocationY+', '+placeLocationX+'), '+zoom+');',
'      }',
'    }',
'    </script>',
'  </head>',
'  <body onload="initialize()" onunload="GUnload()">',
'    <div id="map_canvas" style="width: '+width+'px; height: '+height+'px"></div>',
'  </body>',
'</html>'
].join('\n'));

}

google.register(new mb.RenderingUnitAction({

  type : 'GoogleMapsMarker',
  label : 'Google Maps Marker',
  description : 'Positionate locations with labels in a map with Google Maps',
  iconCls : 'gmaps-uaction',
  inputs : [
    { name : 'records',
      label : 'Input Records',
      type : 'Object[]' },
    { name : 'useFirstRow',
      label : 'Use First Row?',
      type : 'String',
      formElement : "CHECK_BOX" },
    { name : 'labelField',
      label : 'Label Field',
      type : 'String',
      options : [] },
    { name : 'valueField',
      label : 'Address Field',
      type : 'String',
      options : [] },
    { name : 'latField',
      label : 'Latitude Field',
      type : 'String' },
    { name : 'longField',
      label : 'Longitude Field',
      type : 'String' },
    { name : 'width',
      label : 'Width',
      type : 'Integer' },
    { name : 'height',
      label : 'Height',
      type : 'Integer' },
    { name : 'zoomController',
      label : 'Zoom Controller',
      type : 'String',
      formElement : "CHECK_BOX" },
    { name : 'mapTypeController',
      label : 'Map Type Controller',
      type : 'String',
      formElement : "CHECK_BOX" },
    { name : 'mapType',
      label : 'Map type',
      type : 'String', 
      options : [NORMAL_MAP, HYBRID_MAP, SATELITE_TYPE_MAP] },
    { name : 'apiKey',
      label : 'API Key',
      type : 'String' }
  ],

  render : function(params, el) {

    var records = params['records'];
    if (!records) 
      return;
    var labelField = params['labelField'];
    var valueField = params['valueField'];
	
	var latField = params['latField'];  // latitude
	var longField = params['longField']; // longitude
    
    var width  = params['width']  || 500;
    var height = params['height'] || 200;
    
    var apiKey = params['apiKey'] || 'ABQIAAAAQLVYVvhTjXRPtKDa9AsPlhQs1SMlRZa-qyzdhC9kofgBeB67sRRcX48ZCyilXhFK6qqej_uY3YV6AA';
    
    var mapType = params['mapType'] || NORMAL_MAP;
    
    var mapTypeController = false;
    mapTypeController = params['mapTypeController'] || false;
    if(mapTypeController == 'true')
      mapTypeController = true;
  
    var zoomController = false;
    zoomController = params['zoomController'] || false;
    if(zoomController == 'true')
      zoomController = true;

    var useFirstRow = false;
    useFirstRow = params['useFirstRow'] || false;
    if(useFirstRow == 'true')
      useFirstRow = true;
	  
    var iframe = mb.dom.createElement({
      tagName : 'iframe',
      width : width,
      height : height,
      frameBorder : 0,
      allowTransparency : true,
      scrolling : 'no'
    });
    el.appendChild(iframe);
    if (iframe.contentWindow) {
      var doc = iframe.contentWindow.document;
      doc.open();
      renderMapWithMarkers(doc, records, width, height, labelField, valueField, latField, longField, mapTypeController, zoomController, mapType, apiKey, useFirstRow); 
      doc.close(); 
    }
  }

}))

function renderMapWithMarkers(doc, records, width, height, labelField, valueField, latField, longField, mapTypeController, zoomController, mapType, apiKey, useFirstRow) {

  var dataset = [];
  if (!useFirstRow) {
  	records = records.slice(1);
  }
  mb.lang.forEach(records, function(r, i) {
    var label = r[labelField] || i;
    var location = mb.lang.cast('String', r[valueField] || r);
	var lat = r[latField];
	var longv = r[longField];
    dataset.push({location: location, label: label, lat: lat, longv:longv});
  })
  
  // Results in a string that contains JavaScript statements to add a marker for each point
  function drawAllPoints(){
    var string = '';
    var points = [];
    for(var i=0; i<dataset.length; i++) {
      var repeated = false;
	  // look for points that have the same location but different labels
	  // if found, create only 1 point with both labels concatenated
      for(var j=i+1; j<dataset.length; j++) {
        if(dataset[i]['location'] == dataset[j]['location'] && dataset[i]['label'] != dataset[j]['label']) {
          dataset[j]['label'] = dataset[i]['label'] + '<br>' + dataset[j]['label'];
          repeated = true;
          break;
        }
      }
      if (!repeated) {
	  	points.push(dataset[i]);
	  }
    }	
	dataset.forEach(function(point){
		if (point['lat'] && point['lat'] != '') {
			string = string + 'addLatLongMarker(' + point['lat'] + ',' + point['longv'] + ', "' + point['label'] + '");';
		}
		else {
			string = string + 'findLocationAndAddMarker(markers,"' + point['location'] + '", "' + point['label'] + '");';
		}
	});	
    return string;
  }

  doc.write([
'<html>',
'  <head>',
'    <meta http-equiv="content-type" content="text/html; charset=utf-8"/>',
'    <script src="http://maps.google.com/maps?file=api&amp;v=2&amp;key='+apiKey+'" type="text/javascript"></script>',
'    <script type="text/javascript">',
'    var map;',
'    function initialize() {',
'      if (GBrowserIsCompatible()) {',
'        map = new GMap2(document.getElementById("map_canvas"));',
setMapType(mapType),
addZoomMapController(zoomController),
addTypeMapController(mapTypeController),
'        map.setCenter(new GLatLng(0,0));',
'        geocoder = new GClientGeocoder();',
'        var markers = [];',
drawAllPoints(),
'      }',
'    }',
'    function findLocationAndAddMarker(markers, address, label)',
'    {',
'      if (geocoder) {',
'        geocoder.getLatLng(',
'          address,',
'          function(point) {',
'            addMarker(point, label);',
'            markers.push(point);',
'            setCenter(map,markers);',
'          }',
'        );',
'      }',  
'    }',
'    function addLatLongMarker(lat, longv, label)',
'    {',
'	   var geoPoint = new GLatLng(lat, longv);',
'      addMarker(geoPoint, label);',
'    }',
'    function addMarker(point, label)',
'    {',
'      var marker = new GMarker(point);',
'      GEvent.addListener(marker, "click", function() {',
'        marker.openInfoWindowHtml(label);',
'      });',
'      map.addOverlay(marker);',
'    }',
'    function setCenter(map,pointArray){',
'      var north =  -90;',
'      var south =   90;',
'      var east  = -180;',
'      var west  =  180;',
'      pointArray.forEach(function(point){',
'        if(north < point.lat())',
'           north = point.lat();',
'        if(south > point.lat())',
'           south = point.lat();',
'        if(east  < point.lng())',
'           east  = point.lng();',
'        if(west  > point.lng())',
'           west  = point.lng();',
'      });',
'      var latitudeAvg  = Math.abs((north-south)/2);',
'      var longitudeAvg = Math.abs((west-east)/2);',
'      var bounds = new GLatLngBounds(new GLatLng(south,west), new GLatLng(north,east));',
'      var zoom = map.getBoundsZoomLevel(bounds);',
'      map.setCenter(new GLatLng(south+latitudeAvg,west+longitudeAvg), zoom);',
'    }',
'    </script>',
'  </head>',
'  <body onload="initialize()" onunload="GUnload()">',
'    <div id="map_canvas" style="width: '+width+'px; height: '+height+'px"></div>',
'  </body>',
'</html>'
].join('\n'));

}

function setMapType(mapType) {
	
  function auxSetMapType(type) {
    return 'map.setMapType('+type+')';
  }

  if (mapType == SATELITE_TYPE_MAP) {
  	return auxSetMapType('G_SATELLITE_MAP');
  }
  else if (mapType == HYBRID_MAP) {
  	return auxSetMapType('G_HYBRID_MAP');
  }
  return auxSetMapType('G_NORMAL_MAP');
}

function addZoomMapController(controller) {
  if(controller) {
    return 'map.addControl(new GLargeMapControl());'
  }
  return '';
}

function addTypeMapController(controller) {
  if(controller) {
    return 'map.addControl(new GMapTypeControl());'
  }
  return '';
}

// if in mb editor
if (mb.editor) {
  mb.packages.loadScript(mb.packages.scriptBaseURL + '/renderers/plotr-mb-widget.js');
}

mb.packages.register(google, 'google-maps.js');

})()

