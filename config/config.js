module.exports = {
    dbUrl: process.env.DB_URL,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        bufferCommands: false,
        autoCreate: false
    },
    cloudName: process.env.CLOUD_NAME,
    apiKey:  process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
    slatRounds: process.env.SALTS_ROUNDS,
    jwtKey: process.env.JWT_KEY,
    jwtExpiryTime: process.env.JWT_EXPIRY_TIME,
    pageNumber: 1,
    limit: 10
}