"use strict";

class GMap {
  constructor() {
    this.map = null;
    this.location = { lat: 48.864716, lng: 2.349014 }; //paris
    this.listRestos = [];
    window.listRestos = this.listRestos;
    this.listComments = [];
    //this.getAllRestos = this.getAllRestos.bind(this);
    //this.restoCard = this.restoCard.bind(this);
    this.resultsFromPlaces = this.resultsFromPlaces.bind(this);
    this.key = "AIzaSyBIwzALxUPNbatRBj3Xi1Uhp0fFzwWNBkE";
    this.minGrade = 0;
    this.fullyLoaded = true;
    this.markers = [];
    this.needRefresh = false;
    this.readyToAdd = true;
    this.context = "";
    this.userPos = { lat: 48.864716, lng: 2.349014 };
    this.placesServices;
    this.placesStatus;
    this.placesComments = [];
    this.commentsFromPlaces = this.commentsFromPlaces.bind(this);
  }

  initMap() {

    this.map = new google.maps.Map(document.getElementById("map"),
      {
        zoom: 15,
        center: this.location,
      });

    this.geoLoc();
    this.getRestosFromPlaces(this.location);

  }//initMap

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
    let newTitle = $("#newRestoName").val();
    if (this.context === "addresto") {
      const marker = new google.maps.Marker({
        position: location,
        map: this.map,
        icon: "img/restoPos.png",
        title: newTitle
      });
      this.markers.push(marker);
      let newResto = new Restaurant(newTitle, location.lat(), location.lng());
      let comm = new Comment;
      newResto.placesComments.push(comm);
      newResto.placesId = "Resto" + Math.floor(Math.random() * 1000000);
      this.listRestos.push(newResto);
      console.log(this.listRestos);
      console.log(newResto.placeId);
      this.restoCard(newResto);
    }
  }

  setMarkers(grade) {
    this.fullyLoaded = true;
  }

  geoLoc() {
    let infoWindow = new google.maps.InfoWindow();
    let error = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          let pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          let icon = "img/userPos.png";
          this.addMarkerCust(pos, icon);
          infoWindow.setPosition(pos);
          infoWindow.setContent("Vous êtes ici");
          error = false;
          infoWindow.open(this.map);
          this.map.setCenter(pos);
          this.userPos = pos;
        },
        () => {
          this.handleLocationError(true, infoWindow, this.map.getCenter());
        }
      );
    } else {
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

  getRestosFromPlaces(pos) {
    let request = {
      location: pos,
      radius: '500',
      type: ['restaurant']
    };
    const servicePLaces = new google.maps.places.PlacesService(this.map);
    servicePLaces.nearbySearch(request, this.resultsFromPlaces);
  }

  checkDouble(id) {
    const restoFound = this.listRestos.find((resto) => resto.placesId === id);
    return restoFound ? true : false;
  }

  resultsFromPlaces(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < results.length; i++) {
        let restaurant = new Restaurant;
        restaurant.restaurantName = results[i].name;
        restaurant.address = results[i].vicinity;
        restaurant.lat = results[i].geometry.location.lat();
        restaurant.long = results[i].geometry.location.lng();
        restaurant.placesId = results[i].place_id;
        restaurant.avgRate = results[i].rating;

        if (!this.checkDouble(restaurant.placesId)) {
          this.getCommentsFromPlaces(restaurant.placesId);
          this.listRestos.push(restaurant);
        }
      }
    }
  }

  getCommentsFromPlaces(id) {
    let request = {
      placeId: id,
      fields: ['place_id', 'rating', 'reviews']
    };

    const serviceComms = new google.maps.places.PlacesService(this.map);
    serviceComms.getDetails(request, this.commentsFromPlaces, (err) => console.log(err));
  }

  commentsFromPlaces(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      let comm = new Comment;
      comm.commId = results.place_id;
      comm.avgRate = results.rating;
      for (let k = 0; k < results.reviews.length; k++) {
        comm.comment.push(results.reviews[k].text);
        comm.rating.push(results.reviews[k].rating);
      }
      this.listComments.push(comm);

      this.listRestos.forEach((resto) => {
        if (resto.placesId === comm.commId) {
          resto.placesComments.push(comm);
        }
      });
    }
  }


  restosInView(listRestos, bounds) {
    let grade = Number($("#restoGrade").val());
    let gradeMax = Number($("#restoGradeMax").val());
    if (bounds == null || bounds == undefined) return null;
    var selected = [];
    for (let i = 0; i < listRestos.length; i++) {
      if (bounds.contains(new google.maps.LatLng(listRestos[i].lat, listRestos[i].long))) {
        if ($('input[id=allowFilter]').prop('checked')
          && avgRate(listRestos[i]) >= grade
          && avgRate(listRestos[i]) <= gradeMax) {
          selected.push(listRestos[i]);
        }
        if (!$('input[id=allowFilter]').prop('checked')) {
          selected.push(listRestos[i]);
        }
      }
    }

    for (let z = 0; z < selected.length; z++) {
      let selectedResto = selected[z];
      this.restoCard(selectedResto);
    }
    return selected;
  }

  restoCard(restaurant) {
    let noteResto = restaurant.avgRate ? restaurant.avgRate : "aucune note";
    let noteRestoStars = 0.5 * Math.ceil(2 * restaurant.avgRate - 0.5);

    //info panel:
    let id = restaurant.placesId;
    let card = "<div class='restoCard' id='" + id + "'>";
    card += "<table class='tableTitle'><tr><td>";
    card += "<h1 class='title'>" + restaurant.restaurantName + starsToImg(noteRestoStars) + "</h1>";
    card += "<p>Note : " + noteResto + "</p>";
    card += "<p>" + restaurant.address + "</p></td>";
    card += "<td>" + createApiImage(restaurant, this.key) + "</td></tr></table>";
    card += "<input class='secret' type='text' id='restoID' value='" + id + "'></input>";
    card += "<button type='button' id='" + restaurant.placesId + "'  class='buttonComms btn btn-info' data-toggle='collapse' data-target='#infos" + id + "'>Commentaires</button>";
    card += "<div id='infos" + id + "' class='collapse'>";
    card += restoComments(restaurant);
    card += "<div id='div" + restaurant.placesId + "'></div>";
    card += "<label class='inline' for='restoCommGrade'>Votre note : </label>";
    card += "<input class='inline' type='number' class='restoCommGrade form-control mb-2 mr-sm-2' id='gradeID" + id + "' value='3'></input><br>";
    card += "<label class='inline' for='restoComm'>Votre avis : </label>";
    card += "<input class='inline' type='text' class='restoComm form-control mb-2 mr-sm-2' id='commID" + id + "' value=''></input>";
    card += "<button type='input' id='" + id + "' class='restoCommButton btn btn-primary mb-2 inline'>Ok</button>";
    card += "</div>";
    card += "<hr></div>";
    $('#content').append(card);

    if (this.needRefresh) {
      this.deleteMarkers();
      this.needRefresh = false;
    }

    //marking resto
    let lat = restaurant.lat;
    let long = restaurant.long;
    let restoName = restaurant.restaurantName;
    this.addMarker(lat, long, restoName);
  }

  addComment(idRestaurant, stars, comment) {
    console.log(idRestaurant);


    this.listRestos.forEach((resto) => {
      if (resto.placesId === idRestaurant) {
        resto.hasCustomComments = true;
        resto.placesComments[0].rating.push(stars);
        resto.placesComments[0].comment.push(comment);
        avgRate(resto);
        console.log(resto);
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

}