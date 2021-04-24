const mongoose = require('mongoose');

const db = {
  // Connects to mongoDB
  connect: (url, options) => {
    mongoose.connect('mongodb+srv://smm:Rf7kZu2jRZ3Xqyw@cluster0.k5y9y.mongodb.net/smm?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.connection.on('open', function () {
      console.log("\nConnected to mongo successfully\n");
    });

    mongoose.connection.on('disconnect', function () {
      console.log("\nMongo disconnected\n");
    });

    mongoose.connection.on('error', function (err) {
      // console.log('\nMongoose default connection error: ' + err, '\n');
    });

    process.on('SIGINT', function () {
      mongoose.connection.close(function () {
        console.log('\nMongoose default connection disconnected through app termination\n');
        process.exit(0);
      });
    });
  }
}

module.exports = db;