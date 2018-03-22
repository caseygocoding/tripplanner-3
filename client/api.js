const fetchAttractions = () =>
  fetch('/api')
    .then(result => result.json())
    .catch(err => console.error(err));

const fetchItinerary = (id) => {
  return fetch(`/api/itineraries/${id}`)
    .then(result => {
      const resultJSON = result.json();
      console.log(resultJSON);
      // an obj with 3 arrays {
      //  activities: [
      //    {id: name: num_stars: place: {location: [lang, long]} },
      //    {id: name: num_stars: },
      //   ],
      //  hotels: [hotel],
      //  restaurants: [restaurants]
      //   }
      return resultJSON;
    })
    .catch(err => console.error(err));
};

module.exports = {
  fetchAttractions,
  fetchItinerary
};
