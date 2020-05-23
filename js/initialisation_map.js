function initMap() {
    // Définit les options de la map
    let options = {
        zoom: 12,
        center:{lat:48.864716, lng:2.349014} // Centre la map sur Paris
    }

    map = new google.maps.Map(document.getElementById('map'), options)
    infoWindow = new google.maps.InfoWindow

    // Gestion de la géolcalisation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
            }
            // Ajout d'un marqueur à l'emplacement de l'utilisateur
            userMarker = new google.maps.Marker({
                position: {lat:pos.lat, lng:pos.lng},
                map: map,
                title: 'Vous êtes ici',
                animation: google.maps.Animation.DROP,
                icon: '../img/home.png'
            })
            //infoWindow.setPosition(pos)
            //infoWindow.setContent()
            //infoWindow.open(map)
            map.setCenter(pos)
            restaurantNearUser(pos, map)
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter())
        })
        } else {
        // Le navigateur ne supporte pas la géolocalisation
        handleLocationError(false, infoWindow, map.getCenter())
        }
        // requête Json
        requestGet('http://localhost:5500/js/restaurants.json', managGet, map)
}

// Affiche un message d'erreur selon le problème survenu lors de la géolocalisation de l'utilisateur
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos)
    infoWindow.setContent(browserHasGeolocation ?
                          'Erreur: Le service de géolicalisation n\'a pas fonctionné.' :
                          'Erreur: Votre navigateur ne supporte pas la géolocalisation.')
    infoWindow.open(map)
}

// Gestion de la requête effectuée sur le fichier restaurants
function requestGet(url, callback, map) {
    var req = new XMLHttpRequest()
    req.open("GET", url)
    req.addEventListener("load", function () {
        if (req.status >= 200 && req.status < 400) { // Le serveur a réussi à traiter la requête
            callback(map)
        } else {
            // Affichage des informations sur l'échec du traitement de la requête
            console.error(req.status + " " + req.statusText)
        }
    })
    req.addEventListener("error", function () {
        // La requête n'a pas réussi à atteindre le serveur
        console.error("Erreur réseau")
    })
    req.send(null)
}
