"use strict";
var carte= new GMap();


carte.initMap();

let minGrade=$("#restoGrade").val();

function updateList(){
  let restos=carte.restosInView(carte.listRestos,carte.map.getBounds());
  //carte.needRefresh=true; 
  $('#content').html("");
  for( let i=0;i<restos.length;i++){
    carte.restoCard(restos[i],i);
  }

  //RESTOS VENANT DE GOOGLE PLACES
  carte.getRestosFromPlaces(carte.map.getCenter());

}

document.getElementById("restoGrade").onchange = function() {carte.needRefresh=true;}

google.maps.event.addListener(carte.map, 'mousemove', function() {
  //debug only
});

setTimeout(function(){
  updateList();
}, 300);

carte.map.addListener("click", (event) => {
  if(carte.context==="addresto") {
    
  carte.addMarkerResto(event.latLng);
  carte.needRefresh=true;
 //console.log(event.latLng);
  }
  carte.context="";
  
  updateList();

});

google.maps.event.addListener(carte.map, 'bounds_changed', function() {
  if (carte.fullyLoaded) { updateList(); }
});

google.maps.event.addListener(carte.map, 'idle', function() {
  if (carte.fullyLoaded) { updateList(); }
});

$("#restoGradeButton").on("click", function(){
  carte.deleteMarkers();
  //this.needRefresh=true; 
  updateList();
  
});


$("#content").on("click",'.restoCommButton', function(){
 let id= $(this).attr('id');
 let id_=Number(id);
 let stars=Number($("#gradeID"+id).val());
  carte.addComment(id_,stars,$("#commID"+id).val());
 //console.log(carte.listRestos[0]);
 this.needRefresh=true; 
  updateList();
});


$("#newRestoName").on("change", function(){
  
 // carte.context="addresto";
});

$("#newRestoNameButton").on("click", function(){
  
  carte.context="addresto";
 });

 $("#restoNearby").on("click", function(){
  carte.getRestosFromPlaces();
  
 });

