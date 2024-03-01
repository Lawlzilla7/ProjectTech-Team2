const express = require('express');
const app = express();

app
.get('/', onHome)
.get('/', onAbout)
.get('/', onAccount)
.listen(8000)

function onHome(req, res) {
    res.send('<h1>Hello World</h1>')
}

function onAbout(req, res){
    res.send('<h1>About us</h1>')
}

function onAccount(req, res) {
    res.send('<h1>Log hier in!</h1>')
}
