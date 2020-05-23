// Gestion des éléments présent dans le fichier restaurants.json après une réponse positive du serveur lors du traitement de la requête
function managGet(map) {

    // Google Places
    googlePlace(map)

    //Création du filtre
    displayFilter()
    
    //Ajouter un nouveau restaurant
    eventAddRestaurant(map)
    //Filtre
    eventFilter(map)
}

var restaurantSave = (function () {
    var view = []

    var restaurant = {}

    restaurant.addRestaurant = function (newRestaurant) {
        view[view.length] = newRestaurant
    }

    restaurant.clearRestaurant = function () {
        view = []
    }

    restaurant.getRestaurant = function() {
        return view
    }

    return restaurant
}())


var markerSave = (function () {
    var view = []

    var marker = {}

    marker.addMarker = function (newRestaurant) {
        view[view.length] = newRestaurant
    }

    marker.clearMarkers = function () {
        view = []
    }

    marker.getMarker = function() {
        return view
    }

    return marker
}())

var nameSave = (function () {
    var name = null

    var nameRestaurant = {}

    nameRestaurant.addName = function (newName) {
        name = newName
    }

    nameRestaurant.clearName = function () {
        view = []
    }

    nameRestaurant.getName = function() {
        return name
    }

    return nameRestaurant
}())