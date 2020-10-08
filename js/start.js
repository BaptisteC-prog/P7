"use strict";
//import Map from "./Map.js";

function a(){
    alert();
  }

function initMap(){
    //window.renderMap = this.renderMap.bind(this);
    
    let map;
     map=new google.map.Map(document.getElementById("map"),
      {
        zoom: 12,
        center: this.location
 });

}

function start(){
    var map2=new Map;
    map2.initMap();
}

