L.mapbox.accessToken = 'pk.eyJ1IjoiYmdydWJlciIsImEiOiJjaWloeXQ3NGcwMGhrdnFtNXg2a25kbzkyIn0.inMMMxBgfMWXfaAfTKSfOw';
var initExtent = [39.2918809, -76.6400553];
    southWest = L.latLng(38, -78),
    northEast = L.latLng(41, -75),
    bounds = L.latLngBounds(southWest, northEast);

var map = L.mapbox.map('map', 'mapbox.streets', {zoomControl: false});
new L.Control.Zoom({ position: 'topright' }).addTo(map);

var studentCluster = new L.MarkerClusterGroup({
    iconCreateFunction: function (cluster) {
        return L.divIcon({
          className: 'cluster',
          iconSize:L.point(40,40)
        })
    },
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    spiderLegPolylineOptions: {weight: 1, color:'#fff'},
    maxClusterRadius:30
}).addTo(map);

studentCluster.on('clustermouseover', function (a) {
  a.layer.spiderfy();
 });

var locations = omnivore.geojson('data/data.json', null, L.mapbox.featureLayer());
locations.on("ready", function(){
  addLayers(locations)
});

var checkboxes = document.querySelectorAll("input[type=checkbox]");
for (var i=0;i<checkboxes.length;i++){
  var box = checkboxes[i];
  box.addEventListener("click",checkBoxes)
}

function getClass(cOf){
  var classOf = (cOf==2015)?"c15":(cOf==2014)?"c14":(cOf==2013)?"c13":"c12";
  return "marker "+classOf;
}

function checkBoxes(){
  var checked = document.querySelectorAll("input[type=checkbox]:checked");
  var years = [];
  for (var i=0;i<checked.length;i++){
    years.push(checked[i].value)
  }
  filterMap(years);
}

function addLayers(locations){
  map.fitBounds(locations.getBounds());
  locations.eachLayer(function(layer){
    var cOf = layer.feature.properties.Class;
    var cName = getClass(cOf);
    var marker = L.marker([layer.feature.geometry.coordinates[1],layer.feature.geometry.coordinates[0]])
       .setIcon(L.divIcon({
           className: cName,
           iconSize:[15,15],
           popupAnchor:[0,0]
       }))
       .bindPopup(layer.feature.properties.College+"<br>Class of "+layer.feature.properties.Class)
      .addTo(studentCluster)
    marker.on("mouseover",function(evt){
      evt.preventDefault;
      this.openPopup();
    })
   });
}

function filterMap(years){
  studentCluster.clearLayers();
  var locs = locations.setFilter(function(d){return years.indexOf(d.properties["Class"])!=-1});
  addLayers(locs)
}
