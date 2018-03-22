const router = require('express').Router();
const Hotel = require('../models').Hotel;
const Restaurant = require('../models').Restaurant;
const Activity = require('../models').Activity;
const Itinerary = require('../models').Itinerary;

router.get('/', (req, res, next) => {
  Promise.all([
    Hotel.findAll({ include: [{ all: true }] }),
    Restaurant.findAll({ include: [{ all: true }] }),
    Activity.findAll({ include: [{ all: true }] })
  ])
    .then(([hotels, restaurants, activities]) => {
      res.json({
        hotels,
        restaurants,
        activities
      });
    })
    .catch(next);
});

router.get('/itineraries/:id', (req, res, next) => {
  const id = req.params.id;
  Itinerary.findById(id,
    {
      include: [{ all: true, nested: true }]
    }
  )
  .then((itinerary) => {
    // console.log('what is itinerary', itinerary);
    res.json(itinerary); })
  // .then(res.json)
  .catch(next);
});

router.post('/itineraries', (req, res, next) => {
  let itin = Itinerary.build();
  let items = req.body;

  itinerary.setHotels([]);

  itin.
  items.forEach(item => {
    let table = item.category; // 'hotels' --> Hotel.findby
    let id = item.id;

    if (table === 'hotels') {
      itin;

    }

  });
});

module.exports = router;
