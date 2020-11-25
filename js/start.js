"use strict";
var carte= new GMap();


carte.initMap();

let minGrade=$("#restoGrade").val();

function updateList(){
  $('#content').html("");
  carte.markers=[];
  carte.deleteMarkers;
 // carte.getRestosFromPlaces(carte.map.getCenter());

  let restos=carte.restosInView(carte.listRestos,carte.map.getBounds());
  //carte.needRefresh=true; 
 
  
 /* for( let i=0;i<restos.length;i++){
  //  carte.restoCard(restos[i],i);
  }*/

  //RESTOS VENANT DE GOOGLE PLACES
  //carte.getRestosFromPlaces(carte.map.getCenter());

}

document.getElementById("restoGrade").onchange = function() {carte.needRefresh=true;}

google.maps.event.addListener(carte.map, 'mousemove', function() {
  //console.log(carte.placesComments);
});

setTimeout(function(){
  //updateList();
}, 300);

carte.map.addListener("click", (event) => {
  if(carte.context==="addresto") {
    
  carte.addMarkerResto(event.latLng);
  carte.needRefresh=true;
  updateList();
 //console.log(event.latLng);
  }
  carte.context="";
  
  

});

google.maps.event.addListener(carte.map, 'bounds_changed', function() {
  //updateList();
  //if (carte.fullyLoaded) { updateList(); }
});

google.maps.event.addListener(carte.map, 'idle', function() {
  //updateList(); 
  //if (carte.fullyLoaded) { carte.deleteMarkers(); updateList(); }
});


$("#restoNearby").on("click", function(){

  carte.deleteMarkers();
  //this.needRefresh=true; 
  updateList();
  carte.getRestosFromPlaces(carte.map.getCenter());
  
});

$("#restoGradeButton").on("click", function(){
  carte.deleteMarkers();
  //this.needRefresh=true; 
  updateList();
  
});


$("#content").on("click",'.restoCommButton', function(){
 let id= $(this).attr('id');
 //let id_=Number(id);
 let stars=Number($("#gradeID"+id).val());
 console.log(id);
  carte.addComment(id,stars,$("#commID"+id).val());
 //console.log(carte.listRestos[0]);
 this.needRefresh=true; 
  updateList();
});

$("#content").on("click",'.buttonComms', function(){

  let id=$(this).attr('id');
/*
  carte.getCommentsFromPlaces(id);

  let elem="#div"+id;

 // let comments=carte.restoCommentsPlaces(id);
 // $(elem).html(comments);
*/
 });

$("#newRestoName").on("change", function(){

});

$("#newRestoNameButton").on("click", function(){
  
  carte.context="addresto";
  
 });
