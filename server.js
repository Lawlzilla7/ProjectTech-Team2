const express = require('express');
const app = express();



app
  .set('view engine', 'ejs') // Set EJS to be our templating engine
  .set('views', 'views')  // And tell it the views can be found in the directory named views
  .use(express.static('static')) // Allow server to serve static content such as images, stylesheets, fonts or frontend js from the directory named static
  .get('/', onHome)
  .get('/about', onAbout)
  // .get('/account', onAccount)
  // .get('/profile/:name', onProfile)
  .listen(8000)

function onHome(req, res) {
  res.render('pages/index')
}

function onAbout(req, res) {
  res.render('pages/about')
}

// function onAccount(req, res) {
//   res.send('<h1>Log hier in!</h1>')
// }

// function onProfile(req, res) {
//   res.send(`<h1>Profile</h1><p>name: ${req.params.name}</p>`);
// }

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
  console.log("I did not change this message and now my webserver is listening at port ${process.env.PORT}")
})