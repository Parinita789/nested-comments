const winston = require('winston');

exports.logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  this.logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}