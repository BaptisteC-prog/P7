"use strict";

 class GMap{
  constructor()
  {
    this.map=null;
    this.location = {lat: 48.864716, lng: 	2.349014}; //paris
    this.listRestos=[];
    this.getAllRestos=this.getAllRestos.bind(this);
    this.key="AIzaSyBIwzALxUPNbatRBj3Xi1Uhp0fFzwWNBkE";
    this.minGrade=0;
    this.fullyLoaded=false;
    this.markers=[];
    this.needRefresh=false;
    this.readyToAdd=true;
  }

  failure(msg){
    console.log(msg);
  }

  initMap() {
    
    //geoLoc();
     this.map=new google.maps.Map(document.getElementById("map"),
      {
        zoom: 12,
        center: this.location,
     });

     //ajaxGet("resto.json", this.getAllRestos) ;
     fetch("resto.json")
      .then((val) => val.json())
      .then((result) => this.getAllRestos(result));

  }//initMap

  
  addMarker(lat,long,restoName) {
    if (this.readyToAdd) {
      let latLng = new google.maps.LatLng(lat,long);
      //console.log(this);
      let marker = new google.maps.Marker({
      position: latLng,
      map: this.map,
      title: restoName});
      this.markers.push(marker);
      marker.setMap(this.map);
      if (this.fullyLoaded && this.readyToAdd) { 
        this.readyToAdd=false;
      }
    }
  }

  addMarkerCust(pos,icon) {

    //let latLng = new google.maps.LatLng(lat,long);
    //console.log(pos) ;
    let marker = new google.maps.Marker({
    position: pos,
    map: this.map,
    icon: icon});
    this.markers.push(marker);
    marker.setMap(this.map);
  }

  deleteMarkers() {
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    this.markers = [];
  }


  getAllRestos(reponse) {
    //this.listRestos=JSON.parse(reponse);
    this.listRestos=reponse;
    this.setMarkers();
    //this.geoLoc();

  }

  setMarkers(grade=0){
   
    
   if (this.needRefresh) { 
      this.deleteMarkers(); 
      this.needRefresh=false; 
   }

   for ( let resto in this.listRestos.restaurants ) 
     {

       if(avgRate(this.listRestos.restaurants[resto])>=grade) {
          let lat=this.listRestos.restaurants[resto].lat;
          let long=this.listRestos.restaurants[resto].long;
          let restoName=this.listRestos.restaurants[resto].restaurantName;    
          this.addMarker(lat,long,restoName);
       }
     }
    this.fullyLoaded=true;
  }

   geoLoc(){

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
            this.addMarkerCust(pos,icon);
            infoWindow.setPosition(pos);
            infoWindow.setContent("Vous êtes ici");
            infoWindow.open(this.map);
            this.map.setCenter(pos);            
          },
          () => {
            this.handleLocationError(true, infoWindow, this.map.getCenter());
          }
        );
      } else {
        // Browser doesn't support Geolocation
       this.handleLocationError(false, infoWindow, this.map.getCenter());
      }
    }

    handleLocationError(browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(
        browserHasGeolocation
          ? "Erreur: Nous n'avons pas pu vous géolocaliser"
          : "Erreur: Votre navigateur n'accepte pas la géolocalisation"
      );
      infoWindow.open(this);
    }

    restosInView(listRestos,bounds) {
     // console.log(grade);
     let grade=$("#restoGrade").val();

      if (bounds == null || bounds == undefined) return null;
      var selected = [];
      for (let i=0; i < listRestos.restaurants.length; i++) {
          if (bounds.contains(new google.maps.LatLng(listRestos.restaurants[i].lat, listRestos.restaurants[i].long))) {
              if(avgRate(listRestos.restaurants[i])>=grade) {
                  selected.push(listRestos.restaurants[i]); 
               }
          }
      }
      this.setMarkers(grade);
      return selected;
    }

    restoCard(restaurant,idRestaurant){
      //console.log(restaurant);
      //console.log(restaurant.restaurantName);
      if ( true) {
      //let id=Math.floor(Math.random()*1000000);
      let id=idRestaurant;
      let card="<div class='restoCard'>";
      card+="<table class='tableTitle'><tr><td>";
      card+="<h1 class='title'>"+restaurant.restaurantName+starsToImg(avgRate(restaurant))+"</h1>";
      card+="<p>Note : "+avgRate(restaurant)+"</p>";
      card+="<p>"+restaurant.address+"</p></td>";
      card+="<td>"+createApiImage(restaurant,this.key)+"</td></tr></table>";
      card+="<input class='secret' type='text' id='restoID' value='"+idRestaurant+"'></input>";
      card+="<button type='button' class='btn btn-info' data-toggle='collapse' data-target='#infos"+id+"'>Commentaires</button>";
        card+="<div id='infos"+id+"' class='collapse'>";
        card+=restoComments(restaurant);
        card+="<label class='inline' for='restoCommGrade'>Votre note : </label>";
        card+= "<input class='inline' type='number' class='restoCommGrade form-control mb-2 mr-sm-2' id='gradeID"+id+"' value='3'></input><br>";
        card+="<label class='inline' for='restoComm'>Votre avis : </label>";
        card+= "<input class='inline' type='text' class='restoComm form-control mb-2 mr-sm-2' id='commID"+id+"' value=''></input>";
        card+="<button type='input' id='"+id+"' class='restoCommButton btn btn-primary mb-2 inline'>Ok</button>";
        card+="</div>";
      card+="</div><hr>";
      $('#content').append(card);
      //console.log(restoCard);
      //return restoCard;
      }
    }

    addComment(idRestaurant,stars,comment){
        this.listRestos.restaurants[idRestaurant].ratings.push({stars,comment});

        console.log(this.listRestos);
    }

}//class

function starsToImg(stars){
  return "<img src='img/"+stars+".png'>";
}

function createApiImage(restaurant,key){
  //let respSize=Math.floor(window.innerWidth*0.15);
  let image="<img class='apiImage' src='https://maps.googleapis.com/maps/api/streetview?size=300x300&location=";
  //let image="<img class='apiImage' src='https://maps.googleapis.com/maps/api/streetview?size="+respSize+"x"+respSize+"&location="
  image+=restaurant.lat+","+restaurant.long;
  image+="&key="+key+"'>";
  return image;
}

function avgRate(restaurant){
  let grade=0;
  let count=0;
  for ( let rate in restaurant.ratings  ) {
    if (!isNaN(restaurant.ratings[rate].stars) 
    && restaurant.ratings[rate].stars  ) 
      { grade+=restaurant.ratings[rate].stars;
      count++; }
  }
  
  if (count>0) {
    //console.log(grade/count);
    return 0.5*Math.floor(2*grade/count);
  }

}

function restoComments(restaurant){
  let comments="";
  for ( let comm in restaurant.ratings  ) {
    comments+="<div class='comment'><table><tr><td>"+randomAvatar()+"</td>";
    comments+="<td>"+restaurant.ratings[comm].comment+"</td>";
    comments+="<td class='miniStars'>"+starsToImg(restaurant.ratings[comm].stars)+"</td>";
    comments+="</tr></table></div>";
  }
  return comments;
}

function randomAvatar(){
  let id=1+Math.floor(Math.random()*8);
  return "<img src='img/ava"+id+".png'>";
}
