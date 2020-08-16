const winston = require('winston');
 
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: './public/logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: './public/logs/combined.log' }),
  ],
});

module.exports = {
    logger: logger,
    stream: { // send the stream to app to integrate with morgan
        write: (message, encoding) => {
            logger.info(message);
        }
    }
}