const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router()
const { client, connect } = require('../../db')
const collection = client.db('autolijst').collection('auto')

router.get('/', async (req, res, next) => {
    await connect(client)
    //connectie met de database starten
    // numbers:
    for (const veldnaam of ['prijs', 'Bouwjaar', 'kilometers']) {
        if (req.query[veldnaam] !== undefined) {
            req.query[veldnaam] = parseInt(req.query[veldnaam])
        }
    }
    
    let autos = await collection.find(req.query).toArray()
    return res.send(autos)
})

router.get('/filter', async (req, res, next) => {
    await connect(client)
    const doc = (await collection.find({}, { limit: 1 }).toArray()).pop()
    const velden = []
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    for (const veldnaam of Object.keys(doc).filter(v => v !== '_id')) {
        velden.push(`${fullUrl}/${veldnaam}`)
    }

    return res.send(velden)
})

router.get('/filter/:veldnaam', async (req, res, next) => {
    await connect(client)
    return res.send((await collection.distinct(req.params.veldnaam))
        .map(value => {
            return { [value]: req.protocol + '://' + req.get('host') + `/api/auto?${req.params.veldnaam}=${value}` }
        }))
})

router.get('/:id', async (req, res, next) => {
    await connect(client)
    let auto = await collection.findOne({_id: new ObjectId(req.params.id)})
    return res.send(auto)
})

//losse dingen zoals uri (kleur) + (merk) ipv dat het in een url staat

module.exports = router



