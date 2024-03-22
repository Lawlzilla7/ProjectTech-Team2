// nodemon ./server.js 

require('dotenv').config()

const { render } = require('ejs')
const express = require('express')
const app = express()
const xss = require('xss')
const bcrypt = require('bcryptjs')
const session = require('express-session')
const multer  = require('multer')
const upload = multer({ dest: 'static/uploads/' }) 
const path = require('node:path'); 

app
	.set('view engine', 'ejs') // Set EJS to be our templating engine
	.set('views', 'views')  // And tell it the views can be found in the directory named views
	.use(express.urlencoded({ extended: true })) // middleware to parse form data from incoming HTTP request and add form fields to req.body
	.use(express.static('static'))             // Allow server to serve static content such as images, stylesheets, fonts or frontend js from the directory named static
	.get('/', onhome)
	.get('/about/:name', onabout)
	.use(session({
		resave: false,
		saveUninitialized: true,
		secret: process.env.SESSION_SECRET
	}))



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


function onabout(req, res) {
	res.send(`<h1> About ${req.params.name} </h1>`)
}



// Functie voor toevoegen van account
app.get('/signup', onsignup)
app.post('/add-account', addAccount) //Route to handle the post request to /add-movie

function onsignup(req, res) {
	res.render('pages/signup.ejs')
}

async function addAccount(req, res) {
	res.send(`
	<h1> thanks for making an account with
	username: ${req.body.username}
 </h1>`)

 const username = xss(req.body.username)
 const password = xss(req.body.password)
 const email = xss(req.body.email)

 bcrypt.hash(password, 10, async (err, hashedPassword) => {

	{
			const database = client.db('gebruikers');
			const collection = database.collection('accounts');

			const result = await collection.insertOne({
				username: username,
				password: xss(hashedPassword),
				email: email
			});

			console.log(`username ${xss(req.body.username)}`);
			console.log(`hashed password ${xss(hashedPassword)}`);
			console.log(`Added with _id: ${result.insertedId}`);
		}

	});
}



// Functie voor ophalen van account
app.get('/login', onlogin)
app.post('/loggedin', findAccount)

function onlogin(req, res) {
	res.render('pages/login')
}

// app.get ('/start', start)

// function start(req, res) {

// 	if (!username) {
// 		res.redirect('/login', onlogin);
// 		return;
// 	}

// 	else {
// 		res.render('pages/build')
// 	}
// }




async function findAccount(req, res) {

	const username = xss(req.body.username)
	const password = xss(req.body.password)

	const database = client.db('gebruikers');
	const collection = database.collection('accounts');

	const result = await collection.findOne({username: username});
	

	if (result && await bcrypt.compare(password, result.password)) {
			req.session.username = username;
			res.render('pages/login')
			console.log(`Logged in with username ${xss(req.body.username)}`);
		} 
		else {
			res.send(`<h1> Fout bij inloggen. 
			Verkeerde gebruikersnaam of wachtwoord ingevoerd
		 </h1>`)
		}
		
	};
	// console.log(`User with _id: ${result.ObjectId}`);
 


// Functie voor wachtwoord vergeten
app.get('/password', onpassword)

function onpassword(req, res) {
	res.render('pages/password')

}

//Functie voor mijn account
app.get('/myaccount', onaccount)

async function onaccount (req, res) {
	
        // Haal de gebruikersnaam op uit de sessie
        const username = req.session.username;

        // Als de gebruikersnaam niet in de sessie is opgeslagen, doorsturen naar de inlogpagina
        if (!username) {
            res.redirect('/login');
            return;
        }

		const database = client.db('gebruikers');
        const collection = database.collection('accounts');

        const result = await collection.findOne({username: username});

        res.render('pages/myaccount', {user: result});

	console.log(`Sessie gestart met username: ${req.session.username}`)
	}

 // functie voor avatar opslaan
	app.post('/myaccount', upload.single('avatar'), addAvatar)

async function addAvatar(req, res) {
	// console.log(req.file.filename)

	const username = req.session.username;

	const avatarPath = req.file.path;
	const cleanAvatarPath = avatarPath.replace('static/', '');
	
	const database = client.db('gebruikers');
	const collection = database.collection('accounts');

	const result = await collection.updateOne({ username: username },
		{ $set: { avatar: cleanAvatarPath } });

	if (result.modifiedCount === 1) {
		console.log('Avatar succesvol toegevoegd aan het account van', username);
		res.redirect('/myaccount');
	} else {
		console.log('Avatar NIET toegevoegd aan het account van', username);
		res.status(404).send('Avatar niet toegevoegd.');
	}
} 

		

			



	app.get('/logout', (req, res) => {
		// Vernietig de sessie
		req.session.destroy(err => {
			if (err) {
				console.error('Fout bij het uitloggen:', err);
				res.status(500).send('Er is een fout opgetreden bij het uitloggen.');
			} else {
				// Redirect de gebruiker naar de inlogpagina
				res.redirect('/login');
				console.log(`Er is uitgelogd.`)
			}
		});
	});









// Functie voor toevoegen van film
app.get('/addmovie', showAddForm) //middleware: parses form data
app.post('/movies', addMovie) //Route to handle the post request to /add-movie

function showAddForm(req, res) {
	res.render('pages/addmovie.ejs')
}

async function addMovie(req, res) {

	{

		const database = client.db('movielist');
		const collection = database.collection('movies');

		const result = await collection.insertOne({
			title: req.body.title,
			plot: req.body.plot,
			description: req.body.description
		});

		console.log(`Added with _id: ${result.insertedId}`);

		const addedMovie = {
            title: req.body.title,
            plot: req.body.plot,
            description: req.body.description
        };

		const movieList = await collection.find().toArray()
		res.render('pages/movies.ejs', {movies: movieList, addedMovie: addedMovie})

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

client.close();

// Start the webserver and listen for HTTP requests at specified port
app.listen(process.env.PORT, () => {
	console.log(`My webserver is listening at port ${process.env.PORT}`)
})
