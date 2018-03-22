const mapboxgl = require('mapbox-gl');
const api = require('./api');
const buildMarker = require('./marker.js');

/*
 * App State
 */

const state = {
  attractions: {},
  selectedAttractions: []
};

/*
  * Instantiate the Map
  */

mapboxgl.accessToken = 'pk.eyJ1IjoiY2FzZXlnb2NvZGluZyIsImEiOiJjamQxd3NrZjcwamQ0MndwYTFqcGN1MjdpIn0.5YFmc0pCXzAqd28r-IUNJQ';

const fullstackCoords = [-74.009, 40.705]; // NY
// const fullstackCoords = [-87.6320523, 41.8881084] // CHI

const map = new mapboxgl.Map({
  container: 'map',
  center: fullstackCoords,
  zoom: 12, // starting zoom
  style: 'mapbox://styles/mapbox/streets-v10' // mapbox has lots of different map styles available.
});

/*
  * Populate the list of attractions
  */

api.fetchAttractions().then(attractions => {
  state.attractions = attractions;
  const { hotels, restaurants, activities } = attractions;
  hotels.forEach(hotel => makeOption(hotel, 'hotels-choices'));
  restaurants.forEach(restaurant => makeOption(restaurant, 'restaurants-choices'));
  activities.forEach(activity => makeOption(activity, 'activities-choices'));
});

const makeOption = (attraction, selector) => {
  const option = new Option(attraction.name, attraction.id); // makes a new option tag
  const select = document.getElementById(selector);
  select.add(option);
};

/*
  * Attach Event Listeners
  */

// what to do when the `+` button next to a `select` is clicked
['hotels', 'restaurants', 'activities'].forEach(attractionType => {
  document
    .getElementById(`${attractionType}-add`)
    .addEventListener('click', () => handleAddAttraction(attractionType));
});

// Create attraction assets (itinerary item, delete button & marker)
const handleAddAttraction = attractionType => {
  const select = document.getElementById(`${attractionType}-choices`);
  const selectedId = select.value;

  // Find the correct attraction given the category and ID
  const selectedAttraction = state.attractions[attractionType].find(
    attraction => +attraction.id === +selectedId
  );

  // If this attraction is already on state, return
  if (state.selectedAttractions.find(attraction => attraction.id === +selectedId && attraction.category === attractionType)) {return;}

  //Build and add attraction
  buildAttractionAssets(attractionType, selectedAttraction);
};

const buildAttractionAssets = (category, attraction) => {
  // Create the Elements that will be inserted in the dom
  const removeButton = document.createElement('button');
  removeButton.className = 'remove-btn';
  removeButton.append('x');

  const itineraryItem = document.createElement('li');
  itineraryItem.className = 'itinerary-item';
  itineraryItem.append(attraction.name, removeButton);

  // Create the marker
  const marker = buildMarker(category, attraction.place.location);

  // Adds the attraction to the application state
  state.selectedAttractions.push({ id: attraction.id, category });

  //ADD TO DOM
  document.getElementById(`${category}-list`).append(itineraryItem);
  marker.addTo(map);

  // Animate the map
  map.flyTo({ center: attraction.place.location, zoom: 15 });

  removeButton.addEventListener('click', function remove() {
    // Stop listening for the event
    removeButton.removeEventListener('click', remove);

    // Remove the current attrction from the application state
    state.selectedAttractions = state.selectedAttractions.filter(
      selected => selected.id !== attraction.id || selected.category !== category
    );

    // Remove attraction's elements from the dom & Map
    itineraryItem.remove();
    marker.remove();

    console.log(state);

    // Animate map to default position & zoom.
    map.flyTo({ center: fullstackCoords, zoom: 12.3 });
  });
};

if (location.hash) {
  const id = location.hash.slice(1);
  api.fetchItinerary(id)
    .then(itineraryData => {
      itineraryData.hotels.forEach(hotel => buildAttractionAssets('hotels', hotel));
      itineraryData.restaurants.forEach(restaurant => buildAttractionAssets('restaurants', restaurant));
      itineraryData.activities.forEach(activity => buildAttractionAssets('activities', activity));
      console.log('what is state', state.selectedAttractions);
    })
    .catch(console.error);
}

const button = document.getElementById('saved');
button.addEventListener('click', () => {
  const currentItin = state.selectedAttractions;
  fetch('/api/itineraries', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    body: JSON.stringify({
      currentItin
    })
  });
})

