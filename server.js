
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
  .set('view engine', 'ejs')
  .set('views', 'views')
  .use(express.urlencoded({ extended: true }))
  .use(express.static('static'))
  .get('/', onhome)
  .get('/about/:name', onabout)
  .use(session({
	resave: false,
	saveUninitialized: true,
	secret: process.env.SESSION_SECRET
}))
  .get('/detail/:id', onDetail)



// Connectie met MongoDB starten
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	}
})

client.connect()
	.then((res) => {
		console.log('Database connection established')
		console.log(`For uri - ${uri}`)
	})
	.catch((err) => {
		console.log(`Database connection error - ${err}`)
		console.log(`For uri - ${uri}`)
	})

// verwerkt een HTTP-verzoek en rendert de inhoud van de pagina 'index'.
function onhome(req, res) {
  res.render('pages/index')
}

function onabout(req, res) {
	res.send(`<h1> About ${req.params.name} </h1>`)
}

// Rendert de inhoud van de pagina 'detail'.
async function onDetail(req, res) {
	let _id
	try {
		_id = new ObjectId(req.params.id+'')
	} catch(e) {
		res.render('pages/detail', {auto: null})
	}

	const database = client.db('autolijst');
	const collection = database.collection('auto');

	const auto = await collection.findOne({_id})
	return res.render('pages/detail', {auto})
}

//favorieten toevoegen
app.get('/bookmark', onBookmark) 
async function onBookmark(req, res) {
	//Haal de gebruikersnaam op uit de sessie
	const username = req.session.username;
	// Als de gebruikersnaam niet in de sessie is opgeslagen, doorsturen naar de inlogpagina
	if (!username) return res.redirect('/login');
	// haal alle CarIds uit db:
	const dbUsers = client.db('gebruikers');
	const colBookmarks = dbUsers.collection('bookmarks');
	const bookmarks = await colBookmarks.find({ username }).toArray()

	const dbAutos = client.db('autolijst');
	const colAuto = dbAutos.collection('auto');
	const autos = []
	for (id of bookmarks) {
		const auto = await colAuto.findOne({_id: id.car})
		if (auto) autos.push(auto)
	}
	res.render('pages/results', {autos, title: "Favorieten", mode: 'favorites'})
}

app.post('/bookmark', addBookmark)
async function addBookmark(req, res) {
	if (!req.session.username || !req.body.carId) {
		// als niet ingelogd stuur dan naar login
		console.log(req.session, req.body.carId)
		return res.redirect('/login')
	}
	const username = req.session.username
	let _id
	try {
		// geldige ID gepost?
		_id = new ObjectId(req.body.carId + '')
	} catch(e) {
		return res.redirect('/build')
	}
	//check of the auto wel bestaat:
	const dbAutos = client.db('autolijst');
	const colAuto = dbAutos.collection('auto');
	const auto = await colAuto.findOne({_id})
	if (!auto) return res.redirect('/build')

	const dbUsers = client.db('gebruikers');
	const colBookmarks = dbUsers.collection('bookmarks');
	const exisitingBookmark = await colBookmarks.findOne({username, car: _id})
	if (exisitingBookmark) {
		// bookmark bestaat al, prima
		return res.redirect('/bookmark')
	}

	try {
		const result = await colBookmarks.insertOne({username, car: _id})
		console.log('Favoriet succesvol toegevoegd met id:', result.insertedId);
		return res.redirect('/bookmark')
	} catch (error) {
		console.error('Er is een fout opgetreden bij het toevoegen van de favoriet:', error);
		res.status(500).send("Er is een fout opgetreden bij het toevoegen van de favoriet.");
	}
}


app.post('/remove-bookmark', removeBookmark)
async function removeBookmark(req, res) {
	if (!req.session.username || !req.body.carId) {
		// als niet ingelogd stuur dan naar login
		console.log(req.session, req.body.carId)
		return res.redirect('/login')
	}
	let _id
	try {
		// geldige ID gepost?
		_id = new ObjectId(req.body.carId + '')
	} catch(e) {
		return res.redirect('/build')
	}
	const dbUsers = client.db('gebruikers');
	const colBookmarks = dbUsers.collection('bookmarks');
	try {
		await colBookmarks.deleteOne({car: _id})
	} catch (error) {
		console.error('Er is een fout opgetreden bij het verwijderen van de favoriet:', error);
		res.status(500).send("Er is een fout opgetreden bij het verwijderen van de favoriet.");
	}
	return res.redirect('/bookmark')
}


// Functie voor toevoegen van account
app.get('/signup', onsignup)
app.post('/add-account', addAccount) //Route to handle the post request to /add-movie

function onsignup(req, res) {
	res.render('pages/signup.ejs')
}

async function addAccount(req, res) {

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

	res.redirect('/login')

}



// Functie voor ophalen van account
app.get('/login', onlogin)
app.post('/loggedin', findAccount)

function onlogin(req, res) {
	res.render('pages/login')
}


app.get('/build', onbuild) 

function onbuild(req,res) {
	res.render('pages/build')
}


app.get('/start', onstart)

function onstart(req, res) {

	//Haal de gebruikersnaam op uit de sessie
	const username = req.session.username;

	// Als de gebruikersnaam niet in de sessie is opgeslagen, doorsturen naar de inlogpagina
	if (!username) {
		res.redirect('/login');
		return;
	}
	else {
	res.redirect('/build')
	}
}

async function findAccount(req, res) {

	const username = xss(req.body.username)
	const password = xss(req.body.password)

	const database = client.db('gebruikers');
	const collection = database.collection('accounts');

	const result = await collection.findOne({username: username});
	
		if (result && await bcrypt.compare(password, result.password)) {
			req.session.username = username;
			res.render('pages/loggedin');
			console.log(`User with _id: ${result._id}`);
			console.log(`Logged in with username ${xss(req.body.username)}`);
		} 
		else {
			res.render('pages/notloggedin');
		}
	};

 


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

		
//Functie voor gebruikersnaam wijzigen
app.get('/update_username', (req, res) => {
    res.render('pages/update_username');
});

app.post('/updated_username',updateUsername)

async function updateUsername(req,res) {
	
	const database = client.db('gebruikers');
	const collection = database.collection('accounts');

	const username = req.session.username;
	const updatedUsername = req.body.updatedUsername;

	const result = await collection.updateOne(
        { username: username},
        { $set: { username: updatedUsername } }
    );

    if (result.modifiedCount === 1) {
        console.log('Gebruikersnaam succesvol bijgewerkt naar:', req.body.updatedUsername);
		res.redirect('/login');

    } else {
        console.log('Gebruikersnaam niet bijgewerkt.');
		res.send(`<h1> Fout bij het bijwerken van gebruikersnaam.
		 </h1>`)
    }
}

//Functie voor wachtwoord wijzigen
app.get('/update_password', (req, res) => {
    res.render('pages/update_password');
});

app.post('/updated_password',updatePassword)

async function updatePassword(req,res) {
	
	const database = client.db('gebruikers');
	const collection = database.collection('accounts');

	const username = req.session.username;
	const updatedPassword = req.body.updatedPassword;

	bcrypt.hash(updatedPassword, 10, async (err, hashedPassword) => {

		{

	const result = await collection.updateOne(
        { username: username},
        { $set: { password: hashedPassword } });

    if (result.modifiedCount === 1) {
        console.log('Wachtwoord succesvol bijgewerkt');
		res.redirect('/login');

    } else {
        console.log('Wachtwoord niet bijgewerkt.');
		res.send(`<h1> Fout bij het bijwerken van wachtwoord.
		 </h1>`)
    }
}
	})

}



//Functie voor email wijzigen
app.get('/update_email', (req, res) => {
    res.render('pages/update_email');
});

app.post('/updated_email',updateEmail)

async function updateEmail(req,res) {
	
	const database = client.db('gebruikers');
	const collection = database.collection('accounts');

	const username = req.session.username;
	const updatedEmail = req.body.updatedEmail;

	const result = await collection.updateOne(
        { username: username},
        { $set: { email: updatedEmail } }
    );

    if (result.modifiedCount === 1) {
        console.log('Email succesvol bijgewerkt naar:', req.body.updatedEmail);
		res.redirect('/myaccount');

    } else {
        console.log('Email niet bijgewerkt.');
		res.send(`<h1> Fout bij het bijwerken van email.
		 </h1>`)
    }
}
			

 // functie voor uitloggen
	app.get('/logout', (req, res) => {
		// stop de sessie
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


//Functie voor account verwijderen
app.get('/delete_account', (req, res) => {
    res.render('pages/delete_account');
});

app.post('/deleted_account',deleteAccount)

async function deleteAccount(req, res) {

	const database = client.db('gebruikers');
	const collection = database.collection('accounts');

	const username = req.session.username;

	const result = await collection.deleteOne(
		{ username: username });

	console.log('Account verwijderd');

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
};






// Functie voor het laten zien van de API
app.get('/results', filteredresults)

async function filteredresults(req, res) {
	const database = client.db('autolijst');
    const collection = database.collection('auto');
	const autos = await collection.find(req.query).toArray()
	res.render('pages/results', {autos, title: "Resultaten", mode: 'results'})
}


//	



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
// Start the webserver and listen for HTTP requests at specified port
app.listen(process.env.PORT, () => {
	console.log(`My webserver is listening at port ${process.env.PORT}`)
})