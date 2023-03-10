
var flightPath;
var map;
var marker;
var markers = [];
var posReta;
var pontMouse;

var line;
var pt;
var snapped;

var acumula;
var acumula1;
var p1;
var p2;

var arCoord = [];

var juntaCoord = '';

var guideLayer = [
    new google.maps.LatLng(-22.967660000000002, -43.040620000000004),
    new google.maps.LatLng(-22.967200000000002, -43.039950000000005),
    new google.maps.LatLng(-22.966120000000004, -43.036640000000006),
    new google.maps.LatLng(-22.9648, -43.03416)			
			
];
		
	var r1 = ['-22.967660000000002, -43.040620000000004|-22.967200000000002, -43.039950000000005|-22.966120000000004, -43.036640000000006|-22.9648, -43.03416'];

	var coordinates1 = r1[0].split("|");
	var flightPlanCoordinates1 = new Array();
	for(i=0;i<coordinates1.length;i++)
	{  
	  var point1 = [coordinates1[i].split(',')[0],coordinates1[i].split(',')[1]];
	  flightPlanCoordinates1.push(point1);   
	}

	var r=['-22.967660000000002, -43.040620000000004|-22.967200000000002, -43.039950000000005|-22.966120000000004, -43.036640000000006|-22.9648, -43.03416'];
	
	var coordinates = r[0].split("|");
	var flightPlanCoordinates = new Array();
	for(i=0;i<coordinates.length;i++)
	{  
	  var point =new google.maps.LatLng(coordinates[i].split(',')[0],coordinates[i].split(',')[1]);
	  flightPlanCoordinates.push(point);   
	}   

		
    function initialize() {
        var myLatLng = new google.maps.LatLng(-22.966365, -43.037381);
        var mapOptions = {
          zoom: 17,
          center: myLatLng,
		  clickableIcons: false
          //mapTypeId: google.maps.MapTypeId.TERRAIN
        };

        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
                
		flightPath = new google.maps.Polyline({
          path: flightPlanCoordinates,		 
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2,
          editable: false,
          draggable: false
        });						
		
		flightPath.setMap(map);

google.maps.event.addListener(map, 'mousemove', function (point) {

var pontoMouseLat = point.latLng.lat();
var pontoMouseLong = point.latLng.lng();

lat = pontoMouseLat.toFixed(4);
long = pontoMouseLong.toFixed(4);

var formatMouse = '['+pontoMouseLat+', '+pontoMouseLong+']';

pontMouse = [pontoMouseLat,pontoMouseLong];
$('#path').html('<b>Mouse coordinate:</b> '+pontoMouseLat+', '+pontoMouseLong);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

var line1 = turf.lineString(flightPlanCoordinates1);
var start1 = turf.point(flightPlanCoordinates1[0]);
var stop1 = turf.point(flightPlanCoordinates1[3]);

var sliced = turf.lineSlice(start1, stop1, line1);

gravaCoord = [];
distTotal = 0;
				
for (var i=0; i<sliced.geometry.coordinates.length; i++) {
								
	gravaCoord.push(sliced.geometry.coordinates[i].toString()); 
			
	if(gravaCoord.length > 1){
				
		latLonInicial = gravaCoord[i-1];				
		latLonFinal = gravaCoord[i];
				
		var latLonInicialComp = latLonInicial.split(',', 2);
		var lat1 = parseFloat(latLonInicialComp[0]);
		var lon1 = parseFloat(latLonInicialComp[1]);
								
		var latLonFinalComp = latLonFinal.split(',', 2);
		var lat2 = parseFloat(latLonFinalComp[0]);
		var lon2 = parseFloat(latLonFinalComp[1]);					
											
		var R = 6371; // Radius of the earth in km
		var dLat = (lat2 - lat1) * Math.PI / 180;			 
		var dLon = (lon2 - lon1) * Math.PI / 180;			  
		p1 = (lat1 * Math.PI / 180);			  
		p2 = (lat2 * Math.PI / 180);			  
		var a = 
			0.5 - Math.cos(dLat)/2 + 
			Math.cos(p1) * Math.cos(p2) * 
			(1 - Math.cos(dLon))/2;
					
								
		var distanciaAproximada = R * 2 * Math.asin(Math.sqrt(a));
									
		var distanciaAproximadaFormat = distanciaAproximada*1000;			  			  
				
		distTotal += distanciaAproximadaFormat;
				
	}			  
			  
}
			   
	distTotalFormat = Math.round(distTotal);
			  
	$('#distTotal').html('<b>Total line distance:</b> '+distTotalFormat+' meters');			  

calculaPercentualPercurso();

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

line = turf.lineString(flightPlanCoordinates1);
pt = turf.point(pontMouse);
snapped = turf.nearestPointOnLine(line, pt, {units: 'kilometers'});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

var line = turf.lineString(flightPlanCoordinates1);

var start = turf.point([-22.967405399714465, -43.04024916914933]);
var stop1 = turf.point([-22.966446, -43.037543]);

var sliced = turf.lineSlice(start, stop1, line);

$('#distPtr').html('sliced: '+JSON.stringify(sliced));

la = snapped.geometry.coordinates[0];
lo = snapped.geometry.coordinates[1];
posReta = snapped.properties.index;

var distancia = snapped.properties.dist;
var dist1 = distancia*1000;

$('#ponto').html('<b>Line marker coordinate:</b> '+la+','+lo);

$('#distPtr').html('<b>Distance from mouse to line:</b> '+dist1.toFixed(2)+' meters');

var myLatLng = {lat: la, lng: lo};

deleteMarkers();

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

marker = new google.maps.Marker({
          position: myLatLng,
          map: map,
          title: 'Marker'
        });
		
		markers.push(marker);

});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function calculaPercentualPercurso(){

var totalPercurso = distTotalFormat;

var line1 = turf.lineString(flightPlanCoordinates1);
var start1 = turf.point(flightPlanCoordinates1[0]);
var stop1 = turf.point([lat,long]);
var sliced = turf.lineSlice(start1, stop1, line1);
	
gravaCoord1 = [];
distTotal1 = 0;			   	
				
for (var i=0; i<sliced.geometry.coordinates.length; i++) {
								
	gravaCoord1.push(sliced.geometry.coordinates[i].toString()); 
			
	if(gravaCoord1.length > 1){
				
		latLonInicial1 = gravaCoord1[i-1];				
		latLonFinal1 = gravaCoord1[i];				
				
		var latLonInicialComp = latLonInicial1.split(',', 2);
		var lat1 = parseFloat(latLonInicialComp[0]);
		var lon1 = parseFloat(latLonInicialComp[1]);
								
		var latLonFinalComp = latLonFinal1.split(',', 2);
		var lat2 = parseFloat(latLonFinalComp[0]);
		var lon2 = parseFloat(latLonFinalComp[1]);									
			
		var R = 6371; // Radius of the earth in km
		var dLat = (lat2 - lat1) * Math.PI / 180;			 
		var dLon = (lon2 - lon1) * Math.PI / 180;			  
		p1 = (lat1 * Math.PI / 180);			  
		p2 = (lat2 * Math.PI / 180);			  
		var a = 
			0.5 - Math.cos(dLat)/2 + 
			Math.cos(p1) * Math.cos(p2) * 
			(1 - Math.cos(dLon))/2;
				
				 			
		var distanciaAproximada = R * 2 * Math.asin(Math.sqrt(a));
			  		  			  
		var distanciaAproximadaFormat = distanciaAproximada*1000;			  
			  
		distTotal1 += distanciaAproximadaFormat;
			  
	}			  
			  
}
			   
	distTotalFormat1 = Math.round(distTotal1);
			  
	$('#distTotalPercorrida').html('<b>Travelled distance:</b> '+distTotalFormat1+' meters</br><b>Distance to go:</b> '+(totalPercurso-distTotalFormat1)+' meters</br><b>Percentage traveled:</b> '+Math.round((distTotal1 *100)/totalPercurso)+' %');			  
	
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Sets the map on all markers in the array.
      function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
      }

      // Removes the markers from the map, but keeps them in the array.
      function clearMarkers() {
        setMapOnAll(null);
      }

      // Shows any markers currently in the array.
      function showMarkers() {
        setMapOnAll(map);
      }

      // Deletes all markers in the array by removing references to them.
      function deleteMarkers() {
        clearMarkers();
        markers = [];
      }	
}    
