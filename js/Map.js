"use strict";

 class Map{
  constructor()
  {
    this.location = {lat: 48.864716, lng: 	2.349014}; //paris
  }

  initMap(){
    //window.renderMap = this.renderMap.bind(this);
    let map=new google.maps.Map(document.getElementById("map"),
      {
        zoom: 12,
        center: this.location
     });

     ajaxGet("resto.json", function (reponse) 
     {
       let listRestos = JSON.parse(reponse);
       //console.log(listRestos.restaurants[0].lat);
       for ( let resto in listRestos.restaurants ) 
         {
           let lat=listRestos.restaurants[resto].lat;
           let long=listRestos.restaurants[resto].long;
           let latLng = new google.maps.LatLng(lat,long);
           let marker = new google.maps.Marker({
               position: latLng,
               map: map
             });
         }
    });

  }



}

function ajaxGet(url, callback) {
  var req = new XMLHttpRequest();
  req.open("GET", url);
  req.addEventListener("load", function ()
  {
    if (req.status >= 200 && req.status < 400) 
    {
            // Appelle la fonction callback en lui passant la réponse de la requête
            callback(req.responseText);
    } else { console.error(req.status + " " + req.statusText + " " + url); }
  });
   
  req.addEventListener("error", function () 
  {
        console.error("Erreur réseau avec l'URL " + url);
  });
  req.send(null);
}
