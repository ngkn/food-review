function displayRestaurant(tabRestaurants, filter, map) {
  let tabStars = [];

  // Initialise la liste et les markers
  document.getElementById("list-restaurants").innerHTML = "";
  for (let i = 0; i < tabRestaurants.length; i++) {
    if (tabRestaurants[i].marker) {
      tabRestaurants[i].removeMarker();
    }
  }

  markerSave.clearMarkers();
  markerSave.getMarker();

  // Affichage des restaurents et avis
  for (let i = 0; i < tabRestaurants.length; i++) {
    if (
      tabRestaurants[i].calculateAverage() >= filter ||
      tabRestaurants[i].calculateAverage() === 0
    ) {
      // --------- Restaurants --------- //
      // Création du container contenant une partie information et une autre image d'un restaurant
      let aElt = document.createElement("a");
      aElt.href = "#";
      aElt.classList.add("link-container");
      let divElt = document.createElement("div");
      divElt.classList.add("container-restaurant");
      divElt.classList.add(tabRestaurants[i].calculateAverage());
      let divInfoRestaurant = document.createElement("div");
      divInfoRestaurant.classList.add("info-restaurant");
      let divDetailsRestaurantElt = document.createElement("div");
      divDetailsRestaurantElt.classList.add("details-restaurant");
      let divImgRestaurant = document.createElement("div");
      divImgRestaurant.classList.add("img-restaurant");
      //Ajout des informations d'un restaurant dans le container
      //--> Nom du restaurant
      let titleNameRestaurantElt = document.createElement("h5");
      titleNameRestaurantElt.classList.add("name-restaurant");
      titleNameRestaurantElt.textContent = tabRestaurants[i].name;
      //--> Moyenne générale des avis du restaurant
      let spanRatingRestaurant = document.createElement("span");
      spanRatingRestaurant.classList.add("rating-restaurant");
      //----> Affichage de la moyenne des notes en chiffre
      let spanNumberAverageRatingsElt = document.createElement("span");
      spanNumberAverageRatingsElt.classList.add("number-average-ratings");
      spanNumberAverageRatingsElt.textContent = tabRestaurants[
        i
      ].calculateAverage();
      //----> Affichage de la moyenne des notes par des étoiles
      let spanImageStarsAverage = document.createElement("span");
      spanImageStarsAverage.classList.add("img-stars-average");
      tabStars = managStars(tabRestaurants[i].calculateAverage());
      for (let i = 0; i < tabStars.length; i++) {
        let imgStarElt = document.createElement("img");
        imgStarElt.src = tabStars[i];
        spanImageStarsAverage.appendChild(imgStarElt);
      }
      //----> Affichage du nombre total d'avis
      let spanNumberTotalAverage = document.createElement("span");
      spanNumberTotalAverage.classList.add("number-total-average");
      spanNumberTotalAverage.textContent = `(${tabRestaurants[i].ratings.length})`;
      //--> Adresse du restaurant
      let spanAddressRestaurant = document.createElement("span");
      spanAddressRestaurant.classList.add("address-restaurant");
      spanAddressRestaurant.textContent = tabRestaurants[i].address;
      //--> Google Image
      let imgGoogleStreetElt = document.createElement("img");
      imgGoogleStreetElt.src = tabRestaurants[i].googleImg;

      //Ajout des éléments crées dans le DOM
      divInfoRestaurant.appendChild(titleNameRestaurantElt);
      spanRatingRestaurant.appendChild(spanNumberAverageRatingsElt);
      spanRatingRestaurant.appendChild(spanImageStarsAverage);
      spanRatingRestaurant.appendChild(spanNumberTotalAverage);
      divInfoRestaurant.appendChild(spanRatingRestaurant);
      divInfoRestaurant.appendChild(spanAddressRestaurant);
      divImgRestaurant.appendChild(imgGoogleStreetElt);
      divDetailsRestaurantElt.appendChild(divInfoRestaurant);
      divDetailsRestaurantElt.appendChild(divImgRestaurant);
      aElt.appendChild(divDetailsRestaurantElt);
      divElt.appendChild(aElt);
      document.getElementById("list-restaurants").appendChild(divElt);

      // --------- Fonction qui gère l'affichage des commentaires --------- //
      displayComment(tabRestaurants[i], divElt);

      // Place un marker sur la map
      tabRestaurants[i].addMarker(map);
      // tabMarkers[i] = tabRestaurants[i].marker // Enregistre le marker du restaurant dans un tableau
      markerSave.addMarker(tabRestaurants[i].marker);
    }
  }

  eventRestaurant(markerSave.getMarker());
  eventMarker(markerSave.getMarker(), map);
  eventAddRestaurant(map);
  eventAddComment();
}

function displayComment(restaurant, divElt) {
  let tabStarsRating = [];
  // --------- Avis --------- //
  let divRatingsRestaurantElt = document.createElement("div");
  divRatingsRestaurantElt.classList.add("ratings-restaurant");
  divRatingsRestaurantElt.style.display = "none";

  for (let y = 0; y < restaurant.ratings.length; y++) {
    //----> Affichage de la moyenne des notes par des étoiles
    let divInfosRatingElt = document.createElement("div");
    divInfosRatingElt.classList.add("infos-rating");
    let spanImageStarsRating = document.createElement("span");
    spanImageStarsRating.classList.add("img-stars-rating");
    let hrCommentElt = document.createElement("hr");
    hrCommentElt.id = "hr-comment";
    // //----> Affichage de la note sous forme d'un chiffre
    // let spanNumberRating = document.createElement("span")
    // spanNumberRating.classList.add("number-rating")
    // spanNumberRating.textContent = `${tabRestaurants[i].ratings[y].star}`
    //----> Affichage les commentaires
    let spanCommentElt = document.createElement("span");
    spanCommentElt.classList.add("comment-rating");
    spanCommentElt.textContent = restaurant.ratings[y].comment;
    //----> Affichage de la note sous forme d'étoiles
    tabStarsRating = managStars(restaurant.ratings[y].star);
    for (let z = 0; z < tabStarsRating.length; z++) {
      let imgStarElt = document.createElement("img");
      imgStarElt.src = tabStarsRating[z];
      spanImageStarsRating.appendChild(imgStarElt);
      divInfosRatingElt.appendChild(spanImageStarsRating);
      divInfosRatingElt.appendChild(spanCommentElt);
      divRatingsRestaurantElt.appendChild(divInfosRatingElt);
      divRatingsRestaurantElt.appendChild(hrCommentElt);
    }
  }

  //----> Ajout du bouton "Ajouter un commentaire"
  let buttonAddCommentElt = document.createElement("button");
  buttonAddCommentElt.classList.add("add-comment");
  buttonAddCommentElt.id = `button-${restaurant.lat}`;
  buttonAddCommentElt.textContent = "Ajouter un commentaire";

  divRatingsRestaurantElt.appendChild(buttonAddCommentElt);
  divElt.appendChild(divRatingsRestaurantElt);
}

function displayFilter() {
  const NB_START_BEGIN = 3;
  let starFilterBegin = managStars(NB_START_BEGIN);

  for (let i = 0; i < starFilterBegin.length; i++) {
    let aStarFilterElt = document.createElement("a");
    let imgStarFilterElt = document.createElement("img");
    imgStarFilterElt.id = i + 1;
    imgStarFilterElt.src = starFilterBegin[i];

    aStarFilterElt.appendChild(imgStarFilterElt);
    document.getElementById("filter-restaurant").appendChild(aStarFilterElt);
  }
}

function managStars(averageRatings) {
  let tab = [
    "../img/star-empty.png",
    "../img/star-empty.png",
    "../img/star-empty.png",
    "../img/star-empty.png",
    "../img/star-empty.png",
  ];

  for (let i = 0; i < tab.length; i++) {
    if (averageRatings > i) {
      tab[i] = "../img/star-half.png";
      if (averageRatings >= i + 1) {
        tab[i] = "../img/star-filled.png";
      }
    }
  }

  return tab;
}
