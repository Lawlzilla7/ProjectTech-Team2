require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb')
const uri = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT??27017}`
exports.client = new MongoClient(uri)

exports.connect = async (client) => {
    return client.connect()
        .then(() => {
            console.log('Database connection established')
            return client
        })
        .catch((err) => {
            console.log(`Database connection error - ${err}`)
            console.log(`For uri - ${uri}`)
        })
}

