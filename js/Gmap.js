"use strict";

 class GMap{
  constructor()
  {
    this.location = {lat: 48.864716, lng: 	2.349014}; //paris
    
  }

  initMap() {

    //geoLoc();
    let listRestos;

    var carte = new google.maps.Map(document.getElementById("map"),
      {
        zoom: 12,
        center: this.location,
     });

     ajaxGet("resto.json", function getRestos2(reponse) {
      listRestos = JSON.parse(reponse);
      
      //console.log(restoNames[0]);
      //console.log(listRestos.restaurants[0].lat);
      for ( let resto in listRestos.restaurants ) 
        {
          let lat=listRestos.restaurants[resto].lat;
          let long=listRestos.restaurants[resto].long;
          let restoName=listRestos.restaurants[resto].restaurantName;
         addMarker(lat,long,restoName);

        }
     });

     function getRestos(listRestos,bounds) {
      //console.log(bounds);
      if (bounds == null || bounds == undefined) return null;
      var selected = [];
      for (let i=0; i < listRestos.restaurants.length; i++) {
          if (bounds.contains(new google.maps.LatLng(listRestos.restaurants[i].lat, listRestos.restaurants[i].long))) {
              selected.push(listRestos.restaurants[i]);
          }
      }
      return selected;
    }

     function addMarker(lat,long,restoName) {

      let latLng = new google.maps.LatLng(lat,long);

      let marker = new google.maps.Marker({
      position: latLng,
      map: carte,
      title: restoName});
    }

    function addMarkerCust(pos,icon) {

      //let latLng = new google.maps.LatLng(lat,long);
      //console.log(pos) ;
      let marker = new google.maps.Marker({
      position: pos,
      map: carte,
      icon: icon});
    }
  
    function geoLoc(){

    let  infoWindow = new google.maps.InfoWindow();
    
      // Try HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            let pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            let icon="img/userPos.png";
            pos={lat: 48.864716, lng: 	2.349014}; //FAUSSE POSITION A RETIRER
            addMarkerCust(pos,icon);
           /* infoWindow.setPosition(pos);
            infoWindow.setContent("Vous êtes ici");
            infoWindow.open(carte);*/
            carte.setCenter(pos);            
          },
          () => {
            handleLocationError(true, infoWindow, carte.getCenter());
          }
        );
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, carte.getCenter());
      }
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(
        browserHasGeolocation
          ? "Erreur: Nous n'avons pas pu vous géolocaliser"
          : "Erreur: Votre navigateur n'accepte pas la géolocalisation"
      );
      infoWindow.open(carte);
    }

    //MAJ EN CLIQUANT
    google.maps.event.addListener(carte, 'click', function() {
      let restos=getRestos(listRestos,carte.getBounds());


      $('#content').html("");
      for( let i=0;i<restos.length;i++){
        restoCard(restos[i]);
      }
    });
    
    function avgRate(restaurant){
      let grade=0;
      let count=0;
      for ( let rate in restaurant.ratings  ) {
        grade+=restaurant.ratings[rate].stars;
        count++;
      }

      if (count>0) {
        //console.log(grade/count);
        return 0.5*Math.floor(2*grade/count);
      }

    }

    function starsToImg(stars){
      return "<img src='img/"+stars+".png'>";
    }


    function restoCard(restaurant){
      //console.log(restaurant);
      //console.log(restaurant.restaurantName);
      if ( true) {
      let id=Math.floor(Math.random()*1000000);
      let card="<div class='restoCard'><h1 class='title'>"+restaurant.restaurantName+starsToImg(avgRate(restaurant))+"</h1>";
      card+="<p>Note : "+avgRate(restaurant)+"</p>";
      card+="<p>"+restaurant.address+"</p>";
      card+="<button type='button' class='btn btn-info' data-toggle='collapse' data-target='#infos"+id+"'>Commentaires</button>";
        card+="<div id='infos"+id+"' class='collapse'>";
        card+="blabla";

        card+="</div>";
      card+="</div><hr>";
      $('#content').append(card);
      //console.log(restoCard);
      //return restoCard;
      }
    }



  }//initMap


}//class
