class Restaurant {
  constructor(name, address, lat, long) {
    (this.name = name),
      (this.address = address),
      (this.lat = lat),
      (this.long = long),
      (this.googleImg = `https://maps.googleapis.com/maps/api/streetview?size=100x100&location=${this.lat},${this.long}&heading=151.78&pitch=0&key=${config.apiKey}`);
    (this.ratings = new Array()), this.averageRatings, this.marker;
    this.selected = 0;
  }

  managerSelected() {
    if (this.selected === 0) {
      return true;
    } else {
      this.selected = 0;
      return false;
    }
  }

  addMarker(map) {
    this.marker = new google.maps.Marker({
      position: { lat: this.lat, lng: this.long },
      map: map,
      title: this.address,
      icon: "../img/restaurant.png",
      animation: google.maps.Animation.DROP,
      metadata: { name: this.name },
    });
  }

  removeMarker() {
    this.marker.setMap(null);
  }

  addComment(star, comment) {
    this.ratings[this.ratings.length] = new Rating(this.name, star, comment);
  }

  calculateAverage() {
    let average = null;

    if (this.ratings.length != 0) {
      for (let i = 0; i < this.ratings.length; i++) {
        average = average + this.ratings[i].star;
      }
      average = average / this.ratings.length;
      return average.toFixed(1); // Arrondis le résultat
    } else {
      average = 1;
      return average;
    }
  }

  getRestaurant() {
    return `Name:${this.name} Address: ${this.address} Stars: ${this.view.star} Comment: ${this.view.comment}`;
  }
}

class Rating {
  constructor(restaurant, star, comment) {
    this.restaurant = restaurant;
    (this.star = star), (this.comment = comment);
  }
}
