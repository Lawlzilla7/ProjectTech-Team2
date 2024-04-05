
require('dotenv').config()

const { render } = require('ejs')
const express = require('express')
const app = express()
const xss = require('xss')
const bcrypt = require('bcryptjs')
const session = require('express-session')
const multer = require('multer')
const upload = multer({ dest: 'static/uploads/' })
const path = require('node:path');


app
	.set('view engine', 'ejs')
	.set('views', 'views')
	.use(express.urlencoded({ extended: true }))
	.use(express.static('static'))
	.use(session({
		resave: false,
		saveUninitialized: true,
		secret: process.env.SESSION_SECRET}))
	.use('/api/auto', require('./routes/api/auto'))
	.get('/', onhome)
	.get('/detail', onDetail)
	.get('/about/:name', onabout)



// Start use MongoDB
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
// End use MongoDB


function onhome(req, res) {
	res.render('pages/index')
}

function onabout(req, res) {
	res.send(`<h1> About ${req.params.name} </h1>`)
}

function onDetail(req, res) {
	res.render('pages/detail')
}


// Start functie voor toevoegen van account: Sindy
app.get('/signup', onsignup)
app.post('/add-account', addAccount) //Route to handle the post request to /add-movie

function onsignup(req, res) {
	res.render('pages/signup.ejs')
}

async function addAccount(req, res) {

	const username = xss(req.body.username)
	const password = xss(req.body.password)
	const email = xss(req.body.email)

	// Wachtwoord hashen
	bcrypt.hash(password, 10, async (err, hashedPassword) => {
		{
			const database = client.db('gebruikers');
			const collection = database.collection('accounts');

			const result = await collection.insertOne({
				username: username,
				password: xss(hashedPassword),
				email: email
			});

			console.log('username:', username);
			console.log('hashed password:', hashedPassword);
			console.log(`Added with _id: ${result.insertedId}`);
		}
	});
	res.redirect('/login')
}
// End functie voor toevoegen van account: Sindy


// Start functie voor inloggen met account: Sindy
app.get('/login', onlogin)
app.post('/loggedin', findAccount)

function onlogin(req, res) {
	res.render('pages/login')
}

app.get('/build', onbuild)

function onbuild(req, res) {

	const username = req.session.username;

	// Als de gebruikersnaam niet in de sessie is opgeslagen, doorsturen naar de inlogpagina
	if (!username) {
		res.redirect('/login');
		return;
	}
	else {
		res.render('pages/build')
	}
}
// End functie voor inloggen met account: Sindy


// Start checken of de gebruiker is ingelogd, startknop: Sindy
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
// End checken of de gebruiker is ingelogd, startknop: Sindy


// Start account vinden in database: Sindy
async function findAccount(req, res) {

	const username = xss(req.body.username)
	const password = xss(req.body.password)

	const database = client.db('gebruikers');
	const collection = database.collection('accounts');

	const result = await collection.findOne({ username: username });

	if (result && await bcrypt.compare(password, result.password)) {
		req.session.username = username;
		res.render('pages/loggedin');
		console.log(`User with _id: ${result._id}`);
		console.log('Logged in with username:', username);
	}
	else {
		res.render('pages/notloggedin');
	}
};

// End account vinden in database: Sindy


// Start functie voor wachtwoord vergeten pagina: Sindy
app.get('/password', onpassword)

function onpassword(req, res) {
	res.render('pages/password')
}
// End functie voor wachtwoord vergeten pagina: Sindy


// Start functie voor mijn account: Sindy
app.get('/myaccount', onaccount)

async function onaccount(req, res) {

	// Haal de gebruikersnaam op uit de sessie
	const username = req.session.username;

	// Als de gebruikersnaam niet in de sessie is opgeslagen, doorsturen naar de inlogpagina
	if (!username) {
		res.redirect('/login');
		return;
	}

	const database = client.db('gebruikers');
	const collection = database.collection('accounts');

	const result = await collection.findOne({ username: username });

	res.render('pages/myaccount', { user: result });

	console.log('Sessie gestart met username:', username)
}
// End functie voor mijn account: Sindy



// Start functie voor avatar opslaan: Sindy
app.post('/myaccount', upload.single('avatar'), addAvatar)

async function addAvatar(req, res) {

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
// End functie voor avatar opslaan: Sindy


// Start functie voor gebruikersnaam wijzigen: Sindy
app.get('/update_username', (req, res) => {
	res.render('pages/update_username');
});

app.post('/updated_username', updateUsername)

async function updateUsername(req, res) {

	const database = client.db('gebruikers');
	const collection = database.collection('accounts');

	const username = req.session.username;
	const updatedUsername = xss(req.body.updatedUsername);

	const result = await collection.updateOne(
		{ username: username },
		{ $set: { username: updatedUsername } }
	);

	if (result.modifiedCount === 1) {
		console.log('Gebruikersnaam succesvol bijgewerkt naar:', updatedUsername);
		res.redirect('/login');

	} else {
		console.log('Gebruikersnaam niet bijgewerkt.');
		res.send(`<h1> Fout bij het bijwerken van gebruikersnaam.
		 </h1>`)
	}
}
// End functie voor gebruikersnaam wijzigen: Sindy


// Start functie voor wachtwoord wijzigen: Sindy
app.get('/update_password', (req, res) => {
	res.render('pages/update_password');
});

app.post('/updated_password', updatePassword)

async function updatePassword(req, res) {

	const database = client.db('gebruikers');
	const collection = database.collection('accounts');

	const username = req.session.username;
	const updatedPassword = xss(req.body.updatedPassword);

	bcrypt.hash(updatedPassword, 10, async (err, hashedPassword) => {
		{

			const result = await collection.updateOne(
				{ username: username },
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
// End functie voor wachtwoord wijzigen: Sindy



// Start functie voor email wijzigen: Sindy
app.get('/update_email', (req, res) => {
	res.render('pages/update_email');
});

app.post('/updated_email', updateEmail)

async function updateEmail(req, res) {

	const database = client.db('gebruikers');
	const collection = database.collection('accounts');

	const username = req.session.username;
	const updatedEmail = xss(req.body.updatedEmail);

	const result = await collection.updateOne(
		{ username: username },
		{ $set: { email: updatedEmail } }
	);

	if (result.modifiedCount === 1) {
		console.log('Email succesvol bijgewerkt naar:', updatedEmail);
		res.redirect('/myaccount');

	} else {
		console.log('Email niet bijgewerkt.');
		res.send(`<h1> Fout bij het bijwerken van email.
		 </h1>`)
	}
}
// End functie voor email wijzigen: Sindy


// Start functie voor uitloggen: Sindy
app.get('/logout', (req, res) => {
	// stop de sessie
	req.session.destroy(err => {
		if (err) {
			console.error('Fout bij het uitloggen:', err);
			res.status(500).send('Er is een fout opgetreden bij het uitloggen.');
		} else {
			// Redirect de gebruiker naar de inlogpagina
			res.redirect('/login');
			console.log('Er is uitgelogd.')
		}
	});
});
// End functie voor uitloggen: Sindy


// Start functie voor account verwijderen: Sindy
app.get('/delete_account', (req, res) => {
	res.render('pages/delete_account');
});

app.post('/deleted_account', deleteAccount)

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
			console.log('Er is uitgelogd.')
		}
	});
};
// End functie voor account verwijderen: Sindy


// Start functie voor het laten zien van de API: Esmé
app.get('/results', alleResultaten)

async function alleResultaten(req, res) {
	const database = client.db('autolijst');
	const collection = database.collection('auto');

	const autoLijst = await collection.find().toArray()
	res.render('pages/results.ejs', { auto: autoLijst })
}
// End functie voor het laten zien van de API: Esmé


// Start error handling

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
// End error handling