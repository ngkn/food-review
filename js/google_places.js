function googlePlace(map) {
  // Crée un nouveau tableau pour les markers google places, ainsi que les restau ?
  let inputSearch = document.getElementById("search");
  let search = new google.maps.places.SearchBox(inputSearch);
  let markerSearch = [];

  // Fait apparaître les suggestions dans la barre de recherche
  map.addListener("bounds_changed", function () {
    search.setBounds(map.getBounds());
    console.log(search.setBounds(map.getBounds()));
  });

  // Centre la map sur le restaurant choisi
  search.addListener("places_changed", function () {
    let places = search.getPlaces();

    if (places.length === 0) return;
    restaurantSave.clearRestaurant(); // Réinitialise les restaurants
    markerSave.getMarker().forEach(function (m) {
      m.setMap(null);
    });

    markerSearch.forEach(function (m) {
      m.setMap(null);
    }); // Réinitialise le marker sur la map
    markerSearch = []; // Réinitialise la tab marker

    let bounds = new google.maps.LatLngBounds();

    places.forEach(function (p) {
      if (!p.geometry) return; // Si les coordonnées n'ont pas été trouvé sort de la boucle

      markerSearch.push(
        new google.maps.Marker({
          map: map,
          title: p.name,
          position: p.geometry.location,
          animation: google.maps.Animation.DROP,
        })
      );

      if (p.geometry.viewport) bounds.union(p.geometry.viewport);
      // Positionne le map sur le marker en viewport
      else bounds.extend(p.geometry.location);

      // Affiche les restaurants présents aux alentours du magasin recherché
      let service = new google.maps.places.PlacesService(map);
      service.nearbySearch(
        {
          location: p.geometry.location,
          radius: 300,
          type: ["restaurant"],
        },
        nearRestaurantCallback
      ); // parametre map
    });

    map.fitBounds(bounds);
  });
}

// Gère les restaurants affichés aux alentours du restaurant recherché
function nearRestaurantCallback(results, status) {
  let service = new google.maps.places.PlacesService(map);
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      //createMarker(results[i])
      //Récupère les détails du restaurant
      service.getDetails(
        {
          placeId: results[i].place_id,
          fields: [
            "name",
            "rating",
            "formatted_phone_number",
            "geometry",
            "formatted_address",
            "reviews",
            "vicinity",
            "photos",
          ],
        },
        detailsRestaurantCallback
      );
    }
  }
}

// Affiche les restaurants présents aux alentours de la localisation de l'utilisateur
function restaurantNearUser(position, map) {
  const NB_START_FILTER = 1;
  let service = new google.maps.places.PlacesService(map);
  service.nearbySearch(
    {
      location: { lat: position.lat, lng: position.lng },
      radius: 500,
      type: ["restaurant"],
    },
    nearRestaurantCallback
  ); // parametre map
}

function createMarker(position) {
  // Supprimer
  new google.maps.Marker({
    position: position.geometry.location,
    map: map,
    title: position.name,
    icon: "../img/restaurant.png",
    animation: google.maps.Animation.DROP,
  });
}

function detailsRestaurantCallback(result, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    // Crée une instance restaurant
    let restaurant = new Restaurant(
      result.name,
      result.vicinity,
      result.geometry.location.lat(),
      result.geometry.location.lng()
    );

    // //Charge la photo du restaurant
    // restaurant.googleImg = result.photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100})

    // Commentaire
    if (result.reviews) {
      // Si des reviews existe
      for (let i = 0; i < result.reviews.length; i++) {
        if (result.reviews[i].text)
          restaurant.addComment(
            result.reviews[i].rating,
            result.reviews[i].text
          );
        else
          restaurant.addComment(
            result.reviews[i].rating,
            "Aucun commentaire ajouté..."
          ); // Si l'utilisateur n'a pas commenté
      }
    }

    //Enregistre le restaurant
    restaurantSave.addRestaurant(restaurant);
    displayRestaurant(restaurantSave.getRestaurant(), 3, map);
  }
}
