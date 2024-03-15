const express = require('express');
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
            //Voor elk veld wordt gecontroleerd of het overeenkomt met 
            //een queryparameter in het inkomende verzoek. Als het veld 
            //aanwezig is in de queryparameters, gaat de code verder.
            //Als het veld aanwezig is, wordt de waarde ervan omgezet 
            //naar een geheel getal (integer) met behulp van parseInt.

// list van beschikbare velden:
router.get('/filter', async (req, res, next) => {
    await connect(client)
    //erste document ophalen:
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

module.exports = router