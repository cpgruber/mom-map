Tabletop.init({key: '1F1HPj-_x2sA-hl4g2qYyG6Cx2EWo_q8Xdo9Y049QmYM',
             callback: ttCallback,
             simpleSheet: true });

function ttCallback(data){
  var map = init_map();
  init_data(map,data);
}

function init_map(){
  L.mapbox.accessToken = 'pk.eyJ1IjoiYmdydWJlciIsImEiOiJjaWloeXQ3NGcwMGhrdnFtNXg2a25kbzkyIn0.inMMMxBgfMWXfaAfTKSfOw';
  var initExtent = [40, -96];
      southWest = L.latLng(19, -135),
      northEast = L.latLng(51, -60),
      bounds = L.latLngBounds(southWest, northEast);

  var map = L.mapbox.map('map', 'mapbox.streets', {zoomControl: false, maxBounds: bounds, minZoom:3});
  new L.Control.Zoom({ position: 'topright' }).addTo(map);
  return map;
}

function map_grades(data){
  return data.reduce(function(p,n){
    if (p.indexOf(n.class) == -1){
      p.push(n.class);
    }
    return p;
  },[])
  .sort(function(a,b){
    return b - a;
  })
}

function init_data(map,data){
  var studentCluster = new L.MarkerClusterGroup({
    iconCreateFunction: function (cluster) {
        return L.divIcon({
          className:'cluster',
          iconSize:L.point(40,40)
        })
    },
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    spiderLegPolylineOptions: {weight: 1, color:'#fff'},
    maxClusterRadius:30
  }).addTo(map);

  studentCluster.on('clustermouseover', function(a){
    a.layer.spiderfy();
  });

  add_data(map, data,studentCluster);

  var grades = map_grades(data);
  grades.forEach(function(d){
    $("#sidebar ul").append($("<li><label><input type='checkbox' value='"+d+"' checked><span class='btn btn-circle "+ get_icon(d) +"'><i class='fa fa-institution fa-fw'></i></span>&nbsp;&nbsp;Class of "+d+"&nbsp;<i class='icon-change fa fa-check fa-fw'></i></label></li>"))
  })
  $("#sidebar ul").append($("<li><label><span class='btn btn-circle cluster'></span>&nbsp;&nbsp;Multiple Students</label></li>"))
  $("#sidebar input").on("click", function(e){
    var mark = $(this).parent().find(".icon-change");
    if (mark.hasClass("fa-check")){
      mark.removeClass("fa-check").addClass("fa-times");
    }else{
      mark.removeClass("fa-times").addClass("fa-check");
    }
    var class_filter = [];
    $("#sidebar input:checked").each(function(d,e){class_filter.push(e.value)})
    studentCluster.clearLayers();
    var filtered_data = data.filter(function(d){return class_filter.indexOf(d.class) != -1})
    add_data(map, filtered_data, studentCluster)
  })
}

function add_data(map, data, cluster){
  data.forEach(function(d){
    add_point([+d.lat,+d.lon], cluster, get_icon(d.class), get_popup(d));
  });
  map.fitBounds(cluster.getBounds());
}

function add_point(coords, layer, icon, popup){
  L.marker(coords)
  .setIcon(L.divIcon({
    html:"<button class='btn btn-circle "+icon+"' href='#'><i class='fa fa-institution fa-fw'></i></button>",
    className: "icon",
    iconSize:[15,15]
  }))
  .bindPopup(popup)
  .addTo(layer);
}

function get_icon(d){
  return d == "2012" ? "red" :
    d == "2013" ? "orange" :
      d == "2014" ? "green" :
        d == "2015" ? "blue" : "brown";
}

function get_popup(d){
  return d.college+"<br>Class of "+d.class;
}
