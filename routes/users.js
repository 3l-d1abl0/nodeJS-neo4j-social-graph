var express = require('express');
var router = express.Router();
const neo4j = require('neo4j-driver');
//get the config
const config = require('../config/config');
//get the logger
const logger = require('../config/logger');

//Connect to neo
const driver = neo4j.driver(config.neoUri, neo4j.auth.basic(config.neoUsername, config.neoPassword));
const session = driver.session({database: 'socialgraphj'});

/*Accept POST to add person*/
router.post('/addPerson', function(req, res, next){
  //console.log(req.body);
  let person = req.body["person-name"].split(" ");
  //console.log(person);

  session
    .run(`CREATE(n:Person {first_name: '${person[0]}', last_name: '${person[1]}' } ) RETURN n`)
    .then(function(result){
      //console.log(`Result : ${result}`);
      res.redirect('/');
      //session.close();

    })
    .catch(function(error){
      console.log(`/addperson ${error}`);
    })

});

/*Accept POST to add Locations*/
router.post('/addLocation', function(req, res, next){
  //console.log(req.body);

  let city = req.body["city"];
  let state = req.body.state;

  session
    .run(`CREATE(n:Location {city: '${city}', state: '${state}'})`)
    .then(function(result){
      //console.log(`Result : ${result}`);
      res.redirect('/');
    })
    .catch(function(error){
      console.log(`/addperson ${error}`);
    })

});

/*Accept POST to add Work place */
router.post('/addWork', function(req, res, next){

    let name = req.body.name.split(" ");
    let place = req.body.place.split(",");
    let year = req.body.year;

    session
      .run(`MATCH(a:Person {first_name: '${name[0]}', last_name: '${name[1]}' }),
            (b:Location {city:'${place[0]}', state: '${place[1]}'})
            MERGE(a)-[:WORKS_IN{since: ${year} }]->(b)`)
      .then(function(result){

          logger.error(result);
          res.redirect('/');
          //session.close();
      })
      .catch(function(error){
        console.log(`/addWork ${error}`);
      })
});

router.get('/addWork', function(req, res, next){
  res.status(200).json({status: 'ok'});
});

module.exports = router;
