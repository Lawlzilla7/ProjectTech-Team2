require('dotenv').config()

const express = require('express');
const app = express();

app
  .use(express.urlencoded({ extended: true }))
  .use(express.static('static'))
  .set('view engine', 'ejs')
  .set('views', 'views')
  .get('/', onHome)
  .use('/api/auto', require('./routes/api/auto'))
  // .get('/about', onAbout)
  // .get('/profile/:name', onProfile)

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const uri = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}`
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})

client.connect()
  .then(() => {
    console.log('Database connection established')
  })
  .catch((err) => {
    console.log(`Database connection error - ${err}`)
    console.log(`For uri - ${uri}`)
  })

app.get('/', (req, res) => {
  res.send('Hello World!')
})

function onHome(req, res) {
  res.render('pages/index')
}


// Middleware to handle not found errors - error 404
app.use((req, res) => {
  // log error to console
  console.error('404 error at URL: ' + req.url)
  // send back a HTTP response with status code 404
  res.status(404).send('Oeps, er gaat iets mis! 404 error at URL: ' + req.url)
})

// Middleware to handle server errors - error 500
app.use((err, req, res) => {
  // log error to console
  console.error(err.stack)
  // send back a HTTP response with status code 500
  res.status(500).send('500: server error')
})

// Start the webserver and listen for HTTP requests at specified port
app.listen(process.env.PORT, () => {
  console.log(`I did not change this message and now my webserver is listening at port ${process.env.PORT}`)
})