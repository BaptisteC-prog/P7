
function starsToImg(stars) {
    return "<img src='img/" + stars + ".png'>";
  }
  
  function createApiImage(restaurant, key) {
    let image = "<img class='apiImage' src='https://maps.googleapis.com/maps/api/streetview?size=300x300&location=";
    image += restaurant.lat + "," + restaurant.long;
    image += "&key=" + key + "'>";
    return image;
  }
  
  function avgRate(restaurant) {
    let grade = 0;
    let count = 0;
    let avg = 0;
    if (restaurant.hasCustomComments) {
      for (let rate in restaurant.placesComments[0].rating) {
        if (!isNaN(restaurant.placesComments[0].rating[rate])
          && restaurant.placesComments[0].rating[rate]) {
          grade += restaurant.placesComments[0].rating[rate];
          count++;
        }
      }
  
      if (count > 0) {
        restaurant.avgRate = 0.1 * Math.floor(10 * grade / count);
        avg = 0.1 * Math.floor(10 * grade / count);
      }
    }
    else {
      avg = restaurant.avgRate;
    }
    return avg;
  }
  
  function restoComments(restaurant) {
    let comments = "";
  
    for (let comm = 0; comm < 10; comm++) { 
      if (restaurant
        && restaurant.placesComments
        && restaurant.placesComments.length > 0
        && restaurant.placesComments[0].comment[comm] !== undefined) {
  
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
  