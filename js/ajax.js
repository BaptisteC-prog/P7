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

/*
function readTextFile(file, callback) {
  var rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType("application/json");
  rawFile.open("GET", file, true);
  rawFile.onreadystatechange = function() {
      if (rawFile.readyState === 4 && rawFile.status == "200") {
          callback(rawFile.responseText);
      }
  }
  rawFile.send(null);
}
*/
