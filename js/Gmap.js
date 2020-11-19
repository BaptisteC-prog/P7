"use strict";

class GMap {
  constructor() {
    this.map = null;
    this.location = { lat: 48.864716, lng: 2.349014 }; //paris
    this.listRestos = [];
    window.listRestos = this.listRestos;
    this.listComments = [];
    this.getAllRestos = this.getAllRestos.bind(this);
    //this.restoCard = this.restoCard.bind(this);
    this.resultsFromPlaces = this.resultsFromPlaces.bind(this);
    this.key = "AIzaSyBIwzALxUPNbatRBj3Xi1Uhp0fFzwWNBkE";
    this.minGrade = 0;
    this.fullyLoaded = true;
    this.markers = [];
    this.needRefresh = false;
    this.readyToAdd = true;
    this.context = "";
    this.userPos={ lat: 48.864716, lng: 2.349014 };
    this.placesServices;
    this.placesStatus;
    this.placesComments=[];
    this.commentsFromPlaces=this.commentsFromPlaces.bind(this);
  }

  failure(msg) {
    console.log(msg);
  }

  initMap() {

   
    this.map = new google.maps.Map(document.getElementById("map"),
      {
        zoom: 15,
        center: this.location,
      });

 this.geoLoc();
 this.getRestosFromPlaces(this.location);
/*
    fetch("resto.json")
      .then((val) => val.json())
      .then((result) => this.getAllRestos(result));
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
        this.readyToAdd = true; //false en vrai
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
      let comm= new Comment;
      newResto.placesComments.push(comm);
      newResto.placesId="Resto"+Math.floor(Math.random()*1000000);
      this.listRestos.push(newResto);
      console.log(this.listRestos);
      console.log(newResto.placeId);
      this.restoCard(newResto);
    }
  }

  getAllRestos(reponse) {

    //this.listRestos=JSON.parse(reponse);
    //this.listRestos = reponse;
    //this.setMarkers();
  }



  setMarkers(grade) {

    this.fullyLoaded = true;
  }

  geoLoc() {

    let infoWindow = new google.maps.InfoWindow();
    //let userPos={ lat: 48.864716, lng: 2.349014 };
    // Try HTML5 geolocation.
	let error=true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          let pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          let icon = "img/userPos.png";
          //pos = { lat: 48.864716, lng: 2.349014 }; //FAUSSE POSITION A RETIRER
          this.addMarkerCust(pos, icon);
          infoWindow.setPosition(pos);
          infoWindow.setContent("Vous êtes ici");
		  error=false;
          infoWindow.open(this.map);
          this.map.setCenter(pos);
          this.userPos= pos;
        },
        () => {
			//alert("vous avez refusé la geolocalisation");
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
    infoWindow.open(this.map);
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

  checkDouble(id){
    // for (let resto in this.listRestos ){
    //   if (this.listRestos[resto] === id ) { return true;}
    // }

    const restoFound = this.listRestos.find((resto) => resto.placesId === id);
    return restoFound ? true : false;
  }


//NEARBY SEARCH
// on ajoute les resto de nearby search
// on reinjecte les commentaires customs storé séparements
  resultsFromPlaces(results, status){
    //console.log(commentsFrom)
  //  this.restoCard.bind(resultsFromPlaces(results, status));
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      //this.listRestos = [];
      for (let i = 0; i < results.length; i++) {
        //console.log(results);
        let restaurant=new Restaurant;
        restaurant.restaurantName=results[i].name;
        restaurant.address=results[i].vicinity;
        restaurant.lat=results[i].geometry.location.lat();
        restaurant.long=results[i].geometry.location.lng();
        restaurant.placesId=results[i].place_id;
        restaurant.avgRate=results[i].rating;   
       

        if(!this.checkDouble(restaurant.placesId)) {
           this.getCommentsFromPlaces(restaurant.placesId);
           this.listRestos.push(restaurant);
          
          }
      }
    }

  }

  getCommentsFromPlaces(id){

    let request = {
      placeId: id,
      fields: ['place_id','rating','reviews']
    };
  
    const serviceComms = new google.maps.places.PlacesService(this.map);
    serviceComms.getDetails(request, this.commentsFromPlaces, (err) => console.log(err));
  }

  commentsFromPlaces(results,status){
  // console.log("request status: ", status )
    if (status === google.maps.places.PlacesServiceStatus.OK) {
     // console.log("Commentaire : ", results);
      let comm = new Comment;
      comm.commId=results.place_id;
      comm.avgRate=results.rating;
        for (let k=0; k<results.reviews.length;k++) {
          comm.comment.push(results.reviews[k].text);
          comm.rating.push(results.reviews[k].rating);
        }
        this.listComments.push(comm);


        this.listRestos.forEach((resto) => {
          if(resto.placesId === comm.commId) {

            resto.placesComments.push(comm);
          }
        });

    }
  }


  restosInView(listRestos, bounds) {
    // console.log(grade);
    let grade = Number($("#restoGrade").val());
    let gradeMax = Number($("#restoGradeMax").val());
    //console.log(bounds);
    //console.log($('input[id=allowFilter]').prop('checked'));
    if (bounds == null || bounds == undefined) return null;
    var selected = [];
    for (let i = 0; i < listRestos.length; i++) {
      if (bounds.contains(new google.maps.LatLng(listRestos[i].lat, listRestos[i].long))) {
//        console.log(avgRate(listRestos[i]));
        if ($('input[id=allowFilter]').prop('checked') 
        && avgRate(listRestos[i]) >= grade 
        && avgRate(listRestos[i]) <= gradeMax  ) {
          selected.push(listRestos[i]);
        }
        if (!$('input[id=allowFilter]').prop('checked')){
          selected.push(listRestos[i]);
        }
      }
    }

   for(let z=0 ;z<selected.length;z++){
      let selectedResto=selected[z];
      this.restoCard(selectedResto);
   }
    return selected;
  }

  restoCard(restaurant) {
   // console.log(restaurant);
    let noteResto=restaurant.avgRate ? restaurant.avgRate : "aucune note";
    let noteRestoStars=0.5 * Math.ceil(2 * restaurant.avgRate-0.5);
  
    if (true) {
      //info panel:
      let id = restaurant.placesId;
      let card = "<div class='restoCard' id='"+id+"'>";
      card += "<table class='tableTitle'><tr><td>";
      card += "<h1 class='title'>" + restaurant.restaurantName + starsToImg(noteRestoStars) + "</h1>";
      card += "<p>Note : " + noteResto + "</p>"; 
      card += "<p>" + restaurant.address + "</p></td>";
      card += "<td>" + createApiImage(restaurant, this.key) + "</td></tr></table>";
      card += "<input class='secret' type='text' id='restoID' value='" + id + "'></input>";
      card += "<button type='button' id='"+restaurant.placesId+"'  class='buttonComms btn btn-info' data-toggle='collapse' data-target='#infos" + id + "'>Commentaires</button>";
      card += "<div id='infos" + id + "' class='collapse'>";
      card += restoComments(restaurant);
      card += "<div id='div"+restaurant.placesId+"'></div>";
      card += "<label class='inline' for='restoCommGrade'>Votre note : </label>";
      card += "<input class='inline' type='number' class='restoCommGrade form-control mb-2 mr-sm-2' id='gradeID" + id + "' value='3'></input><br>";
      card += "<label class='inline' for='restoComm'>Votre avis : </label>";
      card += "<input class='inline' type='text' class='restoComm form-control mb-2 mr-sm-2' id='commID" + id + "' value=''></input>";
      card += "<button type='input' id='" + id + "' class='restoCommButton btn btn-primary mb-2 inline'>Ok</button>";
      card += "</div>";
      card += "<hr></div>";
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
    let lat=restaurant.lat;
    let long=restaurant.long;
    let restoName=restaurant.restaurantName;
    this.addMarker(lat, long, restoName);

  }

  addComment(idRestaurant, stars, comment) {
    console.log(idRestaurant);
   // const search = (id) => id === idRestaurant;
    //let restoIndex=this.listRestos.placesId.findIndex(search);

    this.listRestos.forEach((resto) => {
      if(resto.placesId === idRestaurant) {
        //console.log(resto);
        resto.hasCustomComments=true;
        resto.placesComments[0].rating.push(stars);
        resto.placesComments[0].comment.push(comment);
        avgRate(resto);
        console.log(resto);
        //resto.placesComments.push(comm);
      }
    });

    this.getRestosFromPlaces(this.map.getCenter());

  }

  restoCommentsPlaces(placesId) {
    let comments = "";
  
    if (placesId !== null) {
  
      for (let i = 0; i < 5; i++) {
        comments += "<div class='comment'><table><tr><td>" + randomAvatar() + "</td>";
        comments += "<td>" + this.placesComments[0].reviews[i].text + "</td>";
        comments += "<td class='miniStars'>" + starsToImg(this.placesComments[0].reviews[i].rating) + "</td>";
      }
  
      return comments;
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
  let avg = 0;
    if (restaurant.hasCustomComments){
    for (let rate in restaurant.placesComments[0].rating) {
      if (!isNaN(restaurant.placesComments[0].rating[rate])
        && restaurant.placesComments[0].rating[rate]) {
        grade += restaurant.placesComments[0].rating[rate];
        count++;
      }
    }

    if (count > 0) {
      restaurant.avgRate=0.1*Math.floor(10 * grade / count);
      avg= 0.1 * Math.floor(10 * grade / count);
    }
  }
  else{
    avg=restaurant.avgRate;
  }
  return avg;
}

//METTRE BOUTON MISE A JOUR PLUTOT QUE LE PASSIF SUR BOUNDS

//METTRE A JOUR ET CALER SUR les vrais valeurs
function restoComments(restaurant) {
  let comments = "";
  //console.log(restaurant);
    for (let comm =0; comm <10; comm++) { //fixed to 10
      if(restaurant 
        && restaurant.placesComments 
        && restaurant.placesComments.length > 0 
        && restaurant.placesComments[0].comment[comm] !== undefined ) {

      comments += "<div class='comment'><table><tr><td>" + randomAvatar() + "</td>";
      comments += "<td>" + restaurant.placesComments[0].comment[comm] + "</td>";
      comments += "<td class='miniStars'>" + starsToImg(restaurant.placesComments[0].rating[comm]) + "</td>";
      comments += "</tr></table></div>";
      }
    }

  return comments;
}


function randomAvatar() {
  let id = 1 + Math.floor(Math.random() * 8);
  return "<img src='img/ava" + id + ".png'>";
}
