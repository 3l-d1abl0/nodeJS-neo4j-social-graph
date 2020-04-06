/*
const winston = require('winston');
 
// Logger configuration
const logConfiguration = {
    exitOnError: false,
    transports: [
        new winston.transports.Console({
            level: 'info'
        }),
        new winston.transports.File({
            level: 'error',
            filename: `../logs/app.log`
        })
    ]
};
 
// Create the logger
const logger = winston.createLogger(logConfiguration);
 
// Export the logger
module.exports = logger;

*/

const winston = require('winston');
//import { createLogger, format, transports } from 'winston';

const { label, combine, timestamp , prettyPrint } = winston.format;
const logger = winston.createLogger({
  format: combine(
        timestamp(),
        prettyPrint(),
      ),
  transports: [
    //new winston.transports.Console(),
    new winston.transports.File({ filename: './logs/error.log' , level: 'error'  }),
    new winston.transports.File({ filename: './logs/info.log' , level: 'info'  }),
  ],
  exitOnError: false,
});

//export default logger;
module.exports = logger;
