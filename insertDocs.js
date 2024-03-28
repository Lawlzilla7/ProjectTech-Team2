const { client, connect } = require('./db')

async function main() {
  await connect(client)
  const collection = client.db('autolijst').collection('auto') 
  for (const file of ['coupe', 'hatchback', 'suv']) {
    const docs = await require(`./static/auto/${file}.json`)
    const result = await collection.insertMany(docs)
    console.log('Inserted docs: ', result)
  }
  return 'done'
}


main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close)