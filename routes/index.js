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
//const session = driver.session();

/* GET home page. */
router.get('/', function(req, res, next) {

  session.run("MATCH (n:Person) RETURN n")
         .then(function(result){
          //console.log(`${result}`);
          /*logger.log({message:'Request recieved', level:'info' ,
        transationId:'one', correlationId:'one',
        request:req.query ,
        operation:'demoFunction' });*/
        //logger.info(result);

          var persons_list =[];
          result.records.forEach(function(record){
              persons_list.push({
                id: record._fields[0].identity.low,
                name: record._fields[0].properties.first_name+' '+record._fields[0].properties.last_name
              });
          });

          //Get all the locations
          session.run("MATCH (n:Location) RETURN n")
          .then(function(result){
              var locations_list =[];
              result.records.forEach(function(record){
                locations_list.push(`${record._fields[0].properties.city} , ${record._fields[0].properties.state}`);
              });

              //console.log(persons_list);
              //console.log(locations_list);

              res.render('index', {
                  title: 'Social-Graph',
                  persons: persons_list,
                  locations: locations_list
              });


          }).catch(function(error){
            console.log(`Error while querying Locations ${error}`);
          })

         })
         .catch(function(error){
            console.log(error);
         });

  //res.render('index', { title: 'Express' });
});

module.exports = router;
