// nodemon ./server.js 

require('dotenv').config() 

const express = require('express')
const app = express()

app 
	.set('view engine', 'ejs') // Set EJS to be our templating engine
	.set('views', 'views')  // And tell it the views can be found in the directory named views
	.use(express.urlencoded({extended: true})) // middleware to parse form data from incoming HTTP request and add form fields to req.body
	.use(express.static('static'))             // Allow server to serve static content such as images, stylesheets, fonts or frontend js from the directory named static
	.get('/', onhome)
	.get('/login', onlogin)
    .get('/about/:name', onabout)



// Use MongoDB
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
// Construct URL used to connect to database from info in the .env file
// const uri = "mongodb+srv://sindy:mongo123@clustertech.5fqnsm1.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTech"
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`
// Create a MongoClient
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
})


// Try to open a database connection
client.connect()
    .then((res) => {
        console.log('Database connection established')
        console.log(`For uri - ${uri}`)
    })
    .catch((err) => {
        console.log(`Database connection error - ${err}`)
        console.log(`For uri - ${uri}`)
    })


function onhome(req, res) {
	res.render('pages/index')
}

function onlogin(req, res) {
    res.render('pages/login')
}


function onabout(req, res) {
	res.send (`<h1> About ${req.params.name} </h1>`)
}



// Functie voor toevoegen van account
app.get('/account', onaccount)
app.post('/add-account', addAccount) //Route to handle the post request to /add-movie

function onaccount(req, res) {
    res.render('pages/account.ejs')
}

async function addAccount(req, res) {
	res.send(`<h1> thanks for making an account with:
	Username: ${req.body.username},
	Password: ${req.body.password}
 </h1>`)

	{
	try {
	  await client.connect();
  
	  const database = client.db('gebruikers');
	  const collection = database.collection('accounts');
  
	  const result = await collection.insertOne({
		username: req.body.username,
		password: req.body.password,
	  });
  
	  console.log(`username ${req.body.username}`); 
	  console.log(`Added with _id: ${result.insertedId}`);

	} catch (error) {
	  console.error('Error adding account:', error);
	} finally {
	  // Close the connection when done
	  await client.close();
	}
}
  }


app.get('/add', showAddForm) //middleware: parses form data
app.post('/add-movie', addMovie) //Route to handle the post request to /add-movie

function showAddForm(req, res) {
  res.render('pages/add.ejs')
}


// Functie voor data formulier weergeven op pagina
  // async function addMovie(req,res) {
// 	res.send(`<h1> thanks for adding the movie with:
// 	title: ${req.body.title},
// 	plot: ${req.body.plot},
// 	and description:  ${req.body.description}
//  </h1>`)}

// Functie voor toevoegen van film
async function addMovie(req, res) {
	res.send(`<h1> thanks for adding the movie with:
	title: ${req.body.title},
	plot: ${req.body.plot},
	and description:  ${req.body.description}
 </h1>`)

	{
	try {
	  await client.connect();
  
	  const database = client.db('movielist');
	  const collection = database.collection('movies');
  
	  const result = await collection.insertOne({
		title: req.body.title,
		plot: req.body.plot,
		description: req.body.description
	  });
  
	  console.log(`Added with _id: ${result.insertedId}`);
	} catch (error) {
	  console.error('Error adding movie:', error);
	} finally {
	  // Close the connection when done
	  await client.close();
	}
}
  }


// async function addMovie(req, res) {
// 	const database = client.db('sample_mflix')
// 	const collection = database.collection('movies')
// 	await client.connect();
// 	{
// 		{
// 			res.send(`<h1> thanks for adding the movie with:
// 		title: ${req.body.title},
// 		plot: ${req.body.plot},
// 		and description:  ${req.body.description}
// 	 </h1>`)
// 		}

// 	}

// 	{
// 		result = await collection.insertOne({
// 			title: req.body.title,
// 			plot: req.body.plot,
// 			description: req.body.description
// 		})

// 		console.log(`Added with _id: ${result.insertedID}`)
// 		// res.render('added.ejs')
		
// 	}
// }
	

// Functie op een film op te halen uit de database
// async function run() {
// 	try {
// 	  const database = client.db('sample_mflix');
// 	  const movies = database.collection('movies');
// 	  // Query for a movie that has the title 'Back to the Future'
// 	  const query = { title: 'Back to the Future' };
// 	  const movie = await movies.findOne(query);
// 	  console.log(movie);
// 	} finally {
// 	  // Ensures that the client will close when you finish/error
// 	  await client.close();
// 	}
//   }
//   run().catch(console.dir);
  






  
// Middleware to handle not found errors - error 404
app.use((req, res) => {
	// log error to console
	console.error('404 error at URL: ' + req.url)
	// send back a HTTP response with status code 404
	res.status(404).send('Sorry foutje! 404 error at URL: ' + req.url)
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
	console.log(`My webserver is listening at port ${process.env.PORT}`)
  })
