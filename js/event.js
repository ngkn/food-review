function eventFilter(map){
    let filterRestaurant = document.getElementById('filter-restaurant')
    
    // Events qui gère le filtrage des restaurants grâce aux étoiles au dessus de la liste
    // Event mouseover
    let functionMouseOverFilter =  function (e){
        let tabStarOver
        let NB_START_FILTER = 3
        if (e.target.id === "1" || e.target.id === "2" || e.target.id === "3" || e.target.id === "4" || e.target.id === "5"){
            tabStarOver = managStars(e.target.id) 
        } else {
            tabStarOver = managStars(NB_START_FILTER)            
        }
            for( let i = 0; i < tabStarOver.length; i++){
                filterRestaurant.childNodes[i].firstChild.src = tabStarOver[i]
            }
    }
    filterRestaurant.addEventListener("mouseover", functionMouseOverFilter)

    //Event mouseout
    let functionMouseOutFilter = function (e) {
        const NB_START_FILTER = 3
        let tabStarOut = managStars(NB_START_FILTER)
        for( let i = 0; i < tabStarOut.length; i++){
            filterRestaurant.childNodes[i].firstChild.src = tabStarOut[i]
        }
    }
    filterRestaurant.addEventListener("mouseout", functionMouseOutFilter)
    
    // Event Click
    let functionClickFilter = function (e) {
        // Supprimer les event survol et son contraire
        filterRestaurant.removeEventListener("mouseover", functionMouseOverFilter)
        filterRestaurant.removeEventListener("mouseout", functionMouseOutFilter)
        let starClick = parseInt(e.target.id)
        let tabStarClick = managStars(starClick)           

        for( let i = 0; i < tabStarClick.length; i++){
            filterRestaurant.childNodes[i].firstChild.src = tabStarClick[i]
        }

        displayRestaurant(restaurantSave.getRestaurant(), starClick, map)
    }
    filterRestaurant.addEventListener("click", functionClickFilter)
}


function eventRestaurant(tabMarkers){
    let oldRestaurantSelected
    let containerRestaurant = document.getElementsByClassName('container-restaurant')
    let linkContainer = document.getElementsByClassName('link-container')
    let nameRestaurant = document.getElementsByClassName('name-restaurant')
    // Event mouseover sur les informations du restaurant
    let functionMouseOver = function (e) {
        this.style.backgroundColor =  'rgb(247, 247, 247)' 
        for (let i = 0; i < tabMarkers.length; i++){ // Change la couleur de l'icone
            if(this.querySelector(".name-restaurant").textContent === tabMarkers[i].metadata.name){
                tabMarkers[i].setIcon('../img/restaurant-red.png')
            }
        } 
    }

    // Event mouseout sur les informations du restaurant
    let functionMouseOut = function (e) {
        this.style.backgroundColor = '' // Garde la couleur de fond
        for (let i = 0; i < tabMarkers.length; i++){ // Change la couleur de l'icone
            if (tabMarkers[i].icon != '../img/restaurant.png'){
                tabMarkers[i].setIcon('../img/restaurant.png')
            }
        } 
    }

    // Event click sur les informations du restaurant  // Améliorer click sur les restaurants et marqueurs
    let functionClick = function (e) {
        if (this.selected === true) {
            this.firstChild.style.backgroundColor =  ''
            this.nextSibling.style.display = 'none'
            this.selected = false               
        } else {
            if(oldRestaurantSelected){
                oldRestaurantSelected.firstChild.style.backgroundColor =  ''
                oldRestaurantSelected.nextSibling.style.display = 'none'
                oldRestaurantSelected.selected = false                
            }
            this.firstChild.style.backgroundColor =  'rgb(247, 247, 247)'   
            this.nextSibling.style.display = 'block'
            this.selected = true
        }
        oldRestaurantSelected = this
    }

    for (let i = 0; i < containerRestaurant.length; i++){
        containerRestaurant[i].addEventListener("mouseover", functionMouseOver)
        containerRestaurant[i].addEventListener("mouseout", functionMouseOut)
        // Evenement sur un autre élément afin de distinguer les couleurs au survol (temporaire) et au clic (permanent)      
        linkContainer[i].addEventListener("click", functionClick)
    }

    // Event click sur les informations du restaurant via les markers sur la map
    for (let i = 0; i < tabMarkers.length; i++){
        google.maps.event.addListener(tabMarkers[i], 'click', function(e){
            // Sélectionne le restaurant correspondant à gauche
            for (let i = 0; i < nameRestaurant.length; i++){
                if(nameRestaurant[i].textContent === `${this.metadata.name}`){
                    if (linkContainer[i].selected === true) {
                        linkContainer[i].firstChild.style.backgroundColor =  ''
                        linkContainer[i].nextSibling.style.display = 'none'
                        linkContainer[i].selected = false               
                    } else {
                        if(oldRestaurantSelected){
                            oldRestaurantSelected.firstChild.style.backgroundColor =  ''
                            oldRestaurantSelected.nextSibling.style.display = 'none'
                            oldRestaurantSelected.selected = false                
                        }
                        linkContainer[i].firstChild.style.backgroundColor =  'rgb(247, 247, 247)'   
                        linkContainer[i].nextSibling.style.display = 'block'
                        linkContainer[i].selected = true
                    }
                    oldRestaurantSelected = linkContainer[i]
                }
            }           
        })
    }

}

function eventMarker(tabMarkers, map){
    var infowindow = new google.maps.InfoWindow()

    for (let i = 0; i < tabMarkers.length; i++){
        // Event click
        google.maps.event.addListener(tabMarkers[i], 'click', function(e){
            // Affiche des informations supplémentaires au dessus d'un marker
            infowindow.setContent('<strong>'+this.metadata.name + '</strong><br />' + this.title)
            infowindow.open(map, this)        
        })

        //Event survol
        google.maps.event.addListener(tabMarkers[i], 'mouseover', function(e){
            document.getElementsByClassName('container-restaurant')[i].style.backgroundColor =  'rgb(245, 245, 245)'   
        })

        //Event fin du survol
        google.maps.event.addListener(tabMarkers[i], 'mouseout', function(e){
            document.getElementsByClassName('container-restaurant')[i].style.backgroundColor =  ''    
        })
    }
}

function eventAddRestaurant(map){
    let restaurantBox = document.getElementById("restaurant-box")
    var geocoder = new google.maps.Geocoder() // Permet de récupérer l'adresse en cliquant sur la map
    let posNewRestaurant = {}
    let addressNewRestaurant

    map.addListener('click', function(event) {
        // Récupère les coordonnées du clique sur la map et les convertis en adresse
        posNewRestaurant.lat = event.latLng.lat()
        posNewRestaurant.long = event.latLng.lng()
        geocoder.geocode({
            'latLng': event.latLng
        }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                addressNewRestaurant = results[0].formatted_address
                restaurantBox.querySelector("#form-restaurant").elements.addressRestaurant.value = addressNewRestaurant
            }
            }
        })
        restaurantBox.querySelector("#form-restaurant").elements.nameRestaurant.value =''
        restaurantBox.style.display = "block"
        managerForm(restaurantBox)
    })

    //Event - Gestion des informations recueillis depuis le formulaire
    document.getElementById("form-restaurant").addEventListener("submit", function (e) {
        
        restaurantSave.addRestaurant(new Restaurant(
            this.elements.nameRestaurant.value,
            addressNewRestaurant,
            posNewRestaurant.lat,
            posNewRestaurant.long               
        ))

        restaurantBox.style.display = "none"
        this.reset()
        e.stopImmediatePropagation()
        e.preventDefault() // Annulation de l'envoi des données
    })
}

function managerForm(box){
    // Ferme la fenêtre si l'utilisateur clique en dehors de la fenêtre
    document.addEventListener("mouseup", function (e) {
            if(e.target != box && e.target.parentNode != box && e.target.parentNode.parentNode != box) {
                if(e.target.type === "submit")  box.style.display 
                else    box.style.display = "none"                    
            }             
    })
}

function eventAddComment() {
    let buttonElts = document.getElementsByClassName("add-comment")
    let commentBox = document.getElementById("comment-box")

    // Event - Fait apparaitre la fenêtre qui va permettre à l'utilisateur d'ajouter un avis
    var functionClick = (function(){
        nameSave.addName(this.parentNode.parentNode.querySelector(".name-restaurant").textContent)
         document.getElementById("title-box").textContent = this.parentNode.parentNode.querySelector(".name-restaurant").textContent
        commentBox.style.display = "block"
        managerForm(commentBox)
    })
    for(let i = 0; i < buttonElts.length; i++){
        buttonElts[i].addEventListener("click", functionClick)
    }
    
    //Event - Gestion des informations recueillis depuis le formulaire
    document.getElementById("form-comment").addEventListener("submit", function (e) {
        
        let tabRestaurants = restaurantSave.getRestaurant()
        for(let i = 0; i < tabRestaurants.length; i++){
            if(tabRestaurants[i].name === nameSave.getName()){
                tabRestaurants[i].addComment(parseInt(this.elements.note.value), this.elements.commentText.value)
            }
        }
    
        commentBox.style.display = "none"
        this.reset()
        e.stopImmediatePropagation() //e.preventDefault() // Annulation de l'envoi des données - problème
        e.preventDefault()
    })
}



// Bind - closure