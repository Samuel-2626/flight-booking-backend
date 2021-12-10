import express from "express";
import bodyPaser from "body-parser";
import Amadeus from "amadeus";

const amadeus = new Amadeus({
    clientId: 'YOUR-API-KEY',
    clientSecret: 'YOUR-API-SECRET',

});

const app = express();
const PORT = 5000;

app.use(bodyPaser.json());

app.get(`/city-and-airport-search/:parameter`, (req, res) => {
	const parameter = req.params.parameter;
	// Which cities or airports start with ’r'?
	amadeus.referenceData.locations
		.get({
			keyword: `${parameter}`,
			subType: Amadeus.location.any,
		})
		.then(function (response) {
			res.send(response.result);
		})
		.catch(function (response) {
			res.send(response);
		});
});



app.post(`/flight-search`, (req, res) => {

    

    const originCode = req.body.originCode;
    const destinationCode = req.body.destinationCode;
    const dateOfDeparture = req.body.dateOfDeparture


    // Find the cheapest flights
    amadeus.shopping.flightOffersSearch.get({
        originLocationCode: `${originCode}`,
        destinationLocationCode: `${destinationCode}`,
        departureDate: `${dateOfDeparture}`,
        adults: '1',
        max: '7'
    }).then(function (response) {
        res.send(response.result);
    }).catch(function (response) {
        res.send(response);
    });
    });


app.post(`/flight-confirmation`, (req, res) => {

    const flight = req.body.flight
    
    // Confirm availability and price
    amadeus.shopping.flightOffers.pricing.post(
        JSON.stringify({
            'data': {
                'type': 'flight-offers-pricing',
                'flightOffers': [flight],
            }
        })
    ).then(function (response) {
            res.send(response.result);
        }).catch(function (response) {
            res.send(response)
        })
    
})


app.post(`/flight-booking`, (req, res) => {

      // Book a flight 

    const flight = req.body.flight;

amadeus.booking.flightOrders.post(
      JSON.stringify({
        'data': {
          'type': 'flight-order',
          'flightOffers': [flight],
          'travelers': [{
            "id": "1",
            "dateOfBirth": "1982-01-16",
            "name": {
              "firstName": "JORGE",
              "lastName": "GONZALES"
            },
            "gender": "MALE",
            "contact": {
              "emailAddress": "jorge.gonzales833@telefonica.es",
              "phones": [{
                "deviceType": "MOBILE",
                "countryCallingCode": "34",
                "number": "480080076"
              }]
            },
            "documents": [{
              "documentType": "PASSPORT",
              "birthPlace": "Madrid",
              "issuanceLocation": "Madrid",
              "issuanceDate": "2015-04-14",
              "number": "00000000",
              "expiryDate": "2025-04-14",
              "issuanceCountry": "ES",
              "validityCountry": "ES",
              "nationality": "ES",
              "holder": true
            }]
          }]
        }
      })
    ).then(function (response) {
    res.send(response.result);
  }).catch(function (response) {
    res.send(response);
  });

});

app.listen(PORT, () => console.log(`Server is running on port: http://localhost:${5000}`));
