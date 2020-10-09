"use strict";

 class GMap{
  constructor()
  {
    this.location = {lat: 48.864716, lng: 	2.349014}; //paris
    // tester une liste de markers pour la prochaine fois
  }

  initMap() {
    //window.renderMap = this.renderMap.bind(this);
    
    var carte = new google.maps.Map(document.getElementById("map"),
      {
        zoom: 12,
        center: this.location,
     });
     
    }
    
  ajaxGet(url, callback) {
    
    var req = new XMLHttpRequest();
    req.open("GET", url);
    req.addEventListener("load", function ()    {
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
      //console.log("OBJECT THIS :");
      //console.log(this);
    }

  getMarkers(){
    //console.log("OBJECT THIS :");
    //console.log(this);
    var markArray=[];
    this.ajaxGet("resto.json", function  (reponse) 
    {
      let listRestos = JSON.parse(reponse);
      
      //console.log(listRestos.restaurants[0].lat);
      for ( let resto in listRestos.restaurants ) 
        {
          let lat=listRestos.restaurants[resto].lat;
          let long=listRestos.restaurants[resto].long;

         // let latLng = new google.maps.LatLng(lat,long);
          markArray.push(lat);
          markArray.push(long);
        }
     });
     return markArray;
  }


  addMarkers(){
   // console.log("OBJECT THIS :");
   // console.log(this);
    let markArray=this.getMarkers();
    console.log(markArray);
    console.log("mark array length :"+markArray.length);
   // alert(markArray.length);
   let test=0;
    //console.log(markArray[0]);
    for (let mark=0;mark<4;mark=mark+2) {
      //alert();
      let lat=markArray[mark];
      let long=markArray[mark+1];
      let latLng = new google.maps.LatLng(lat,long);
      console.log(this);
      let marker = new google.maps.Marker({
        position: latLng,
        map: this
      });
     }
  }




}
