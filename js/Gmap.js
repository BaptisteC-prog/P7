"use strict";

class GMap {
  constructor() {
    this.map = null;
    this.location = { lat: 48.864716, lng: 2.349014 }; //paris
    this.listRestos = [];
    this.getAllRestos = this.getAllRestos.bind(this);
    //this.restoCard = this.restoCard.bind(this);
    this.resultsFromPlaces = this.resultsFromPlaces.bind(this);
    this.key = "AIzaSyBIwzALxUPNbatRBj3Xi1Uhp0fFzwWNBkE";
    this.minGrade = 0;
    this.fullyLoaded = false;
    this.markers = [];
    this.needRefresh = false;
    this.readyToAdd = true;
    this.context = "";
    this.userPos={ lat: 48.864716, lng: 2.349014 };
    this.placesServices;
    this.placesStatus;
  }

  failure(msg) {
    console.log(msg);
  }

  initMap() {

    //geoLoc();
    this.map = new google.maps.Map(document.getElementById("map"),
      {
        zoom: 12,
        center: this.location,
      });
    fetch("resto.json")
      .then((val) => val.json())
      .then((result) => this.getAllRestos(result));
    
      //////////////////////////////////////////////////////////
      /*var service;
      service = new google.maps.places.PlacesService(this.map);
      service.nearbySearch(request, callback);

      function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            console.log(results[i]);
            //createMarker(results[i]);
          }
        }
      }
      */

  }//initMap

  //JSDOC
  /**
   * @param  {string} lat
   * @param  {string} long
   * @param  {string} restoName
   */
  addMarker(lat, long, restoName) {
    if (true) {
      let latLng = new google.maps.LatLng(lat, long);
      let marker = new google.maps.Marker({
        position: latLng,
        map: this.map,
        title: restoName
      });
      this.markers.push(marker);
      marker.setMap(this.map);
      if (this.fullyLoaded && this.readyToAdd) {
        this.readyToAdd = false;
      }
    }
  }

  addMarkerCust(pos, icon) {
    let marker = new google.maps.Marker({
      position: pos,
      map: this.map,
      icon: icon
    });
    this.markers.push(marker);
    marker.setMap(this.map);
  }

  deleteMarkers() {
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    this.markers = [];
  }

  addMarkerResto(location) {

    // this.listRestos.restaurants.push($("#newRestoName").val());
    //console.log(this.listRestos);
    let newTitle = $("#newRestoName").val();
    if (this.context === "addresto") {
      const marker = new google.maps.Marker({
        position: location,
        map: this.map,
        icon: "img/restoPos.png",
        title: newTitle
      });
      this.markers.push(marker);
      let newResto= new Restaurant(newTitle,location.lat(),location.lng());
      this.listRestos.restaurants.push(newResto);
      console.log(this.listRestos);
    }
  }

  getAllRestos(reponse) {
    //this.listRestos=JSON.parse(reponse);
    this.listRestos = reponse;
    this.setMarkers();
  }



  setMarkers(grade) {

    this.fullyLoaded = true;
  }

  geoLoc() {

    let infoWindow = new google.maps.InfoWindow();
    //let userPos={ lat: 48.864716, lng: 2.349014 };
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          let pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          let icon = "img/userPos.png";
          pos = { lat: 48.864716, lng: 2.349014 }; //FAUSSE POSITION A RETIRER
          this.addMarkerCust(pos, icon);
          infoWindow.setPosition(pos);
          infoWindow.setContent("Vous êtes ici");
          infoWindow.open(this.map);
          this.map.setCenter(pos);
          this.userPos= pos;
        },
        () => {
          this.handleLocationError(true, infoWindow, this.map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      this.handleLocationError(false, infoWindow, this.map.getCenter());
    }
    return this.userPos;
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

  getRestosFromPlaces(pos){
    let request = {
      location: pos,
      radius: '500',
      type: ['restaurant']
    };
    const servicePLaces = new google.maps.places.PlacesService(this.map);
    //this.placesStatus=new google.maps.places.PlacesServiceStatus;
    servicePLaces.nearbySearch(request, this.resultsFromPlaces);
  }

  restosInView(listRestos, bounds) {
    // console.log(grade);
    let grade = $("#restoGrade").val();
    let gradeMax = $("#restoGradeMax").val();
    //console.log(bounds);
    //console.log($('input[id=allowFilter]').prop('checked'));
    if (bounds == null || bounds == undefined) return null;
    var selected = [];
    for (let i = 0; i < listRestos.restaurants.length; i++) {
      if (bounds.contains(new google.maps.LatLng(listRestos.restaurants[i].lat, listRestos.restaurants[i].long))) {
        if ($('input[id=allowFilter]').prop('checked') 
        && avgRate(listRestos.restaurants[i]) >= grade 
        && avgRate(listRestos.restaurants[i]) <= gradeMax  ) {
          selected.push(listRestos.restaurants[i]);
        }
        if (!$('input[id=allowFilter]').prop('checked')){
          selected.push(listRestos.restaurants[i]);
        }
      }
    }
   // console.log("setmarkers1"+grade);
    this.setMarkers(grade);
    return selected;
  }

  restoCard(restaurant, idRestaurant,rating=null) {
    let noteResto;
    let noteRestoStars;
    if (rating === null ) {
       noteResto=avgRate(restaurant);
       noteRestoStars=noteResto }
    else {
      noteResto=rating;
      noteRestoStars=0.5*Math.floor(2*rating);
    }

    if (true) {
      //info panel:
      let id = idRestaurant;
      let card = "<div class='restoCard'>";
      card += "<table class='tableTitle'><tr><td>";
      card += "<h1 class='title'>" + restaurant.restaurantName + starsToImg(noteRestoStars) + "</h1>";
      card += "<p>Note : " + noteResto + "</p>"; 
      card += "<p>" + restaurant.address + "</p></td>";
      card += "<td>" + createApiImage(restaurant, this.key) + "</td></tr></table>";
      card += "<input class='secret' type='text' id='restoID' value='" + idRestaurant + "'></input>";
      card += "<button type='button' class='btn btn-info' data-toggle='collapse' data-target='#infos" + id + "'>Commentaires</button>";
      card += "<div id='infos" + id + "' class='collapse'>";
      card += restoComments(restaurant);
      card += "<label class='inline' for='restoCommGrade'>Votre note : </label>";
      card += "<input class='inline' type='number' class='restoCommGrade form-control mb-2 mr-sm-2' id='gradeID" + id + "' value='3'></input><br>";
      card += "<label class='inline' for='restoComm'>Votre avis : </label>";
      card += "<input class='inline' type='text' class='restoComm form-control mb-2 mr-sm-2' id='commID" + id + "' value=''></input>";
      card += "<button type='input' id='" + id + "' class='restoCommButton btn btn-primary mb-2 inline'>Ok</button>";
      card += "</div>";
      card += "</div><hr>";
      $('#content').append(card);
      //console.log(restoCard);
      //return restoCard;
    }
    if (this.needRefresh) {
      this.deleteMarkers();
      //alert("need refresh");
      this.needRefresh = false;
    }

    //marking resto
    let lat;
    let long;
    let restoName;
    console.log("ID GET "+idRestaurant);
    if(idRestaurant>1000){
      lat=restaurant.lat;
      long=restaurant.long;
      restoName=restaurant.restaurantName;
    }
    else{
    
    lat = this.listRestos.restaurants[idRestaurant].lat;
    long = this.listRestos.restaurants[idRestaurant].long;
    restoName = this.listRestos.restaurants[idRestaurant].restaurantName;
    }
    this.addMarker(lat, long, restoName);
  }

  addComment(idRestaurant, stars, comment) {
    this.listRestos.restaurants[idRestaurant].ratings.push({ stars, comment });

    console.log(this.listRestos);
  }

  resultsFromPlaces(results, status){
  //  this.restoCard.bind(resultsFromPlaces(results, status));
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < results.length; i++) {
        console.log(results);
        let restaurant=new Restaurant;
        restaurant.restaurantName=results[i].name;
        restaurant.address=results[i].vicinity;
        restaurant.lat=results[i].geometry.location.lat();
        restaurant.long=results[i].geometry.location.lng();
        let rating=results[i].rating;
       i++;
      // console.log("Mon this : ", this); 
      let id=Math.floor(1000+i);
      console.log(i);
      console.log("ID SEND "+id);
      console.log("SEND "+results[i].name);
      
       this.restoCard(restaurant, id,rating);
      //  createMarker(results[i]);
      }
    }
  }

}//class

function starsToImg(stars) {
  return "<img src='img/" + stars + ".png'>";
}

function createApiImage(restaurant, key) {
  //let respSize=Math.floor(window.innerWidth*0.15);
  let image = "<img class='apiImage' src='https://maps.googleapis.com/maps/api/streetview?size=300x300&location=";
  //let image="<img class='apiImage' src='https://maps.googleapis.com/maps/api/streetview?size="+respSize+"x"+respSize+"&location="
  image += restaurant.lat + "," + restaurant.long;
  image += "&key=" + key + "'>";
  return image;
}

function avgRate(restaurant) {
  let grade = 0;
  let count = 0;
  for (let rate in restaurant.ratings) {
    if (!isNaN(restaurant.ratings[rate].stars)
      && restaurant.ratings[rate].stars) {
      grade += restaurant.ratings[rate].stars;
      count++;
    }
  }

  if (count > 0) {
    //console.log(grade/count);
    return 0.5 * Math.floor(2 * grade / count);
  }

}

function restoComments(restaurant) {
  let comments = "";
  for (let comm in restaurant.ratings) {
    comments += "<div class='comment'><table><tr><td>" + randomAvatar() + "</td>";
    comments += "<td>" + restaurant.ratings[comm].comment + "</td>";
    comments += "<td class='miniStars'>" + starsToImg(restaurant.ratings[comm].stars) + "</td>";
    comments += "</tr></table></div>";
  }
  return comments;
}

function randomAvatar() {
  let id = 1 + Math.floor(Math.random() * 8);
  return "<img src='img/ava" + id + ".png'>";
}
