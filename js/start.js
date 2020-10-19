"use strict";
var carte= new GMap();


carte.initMap();

let minGrade=$("#restoGrade").val();

function updateList(){
  let restos=carte.restosInView(carte.listRestos,carte.map.getBounds());
  
  $('#content').html("");
  for( let i=0;i<restos.length;i++){
    carte.restoCard(restos[i],i);
  }
}

document.getElementById("restoGrade").onchange = function() {carte.needRefresh=true;};

google.maps.event.addListener(carte.map, 'click', function() {
    updateList();
});


google.maps.event.addListener(carte.map, 'bounds_changed', function() {
  if (carte.fullyLoaded) { updateList(); }
});

google.maps.event.addListener(carte.map, 'idle', function() {
  if (carte.fullyLoaded) { updateList(); }
});

$("#restoGradeButton").on("click", function(){
  
  updateList();
});


$("#content").on("click",'.restoCommButton', function(){
 let id= $(this).attr('id');
 let id_=Number(id);
 let stars=Number($("#gradeID"+id).val());
  carte.addComment(id_,stars,$("#commID"+id).val());
 console.log(carte.listRestos[0]);
  updateList();
});


$("#newRestoName").on("change", function(){
  
  carte.readyToAdd=true;
});
