import express from 'express'
import { mongoUrl } from './config'
import { MongoClient } from 'mongodb'
import graphqlHTTP from 'express-graphql'
import getSchema from './schema'
import { graphql } from 'graphql'
import { introspectionQuery } from 'graphql/utilities'
import fs from 'fs'

let app = express()
app.use(express.static('public'))

let counter = 0


let db
(
  async function connect() {
    try {
      const db = await MongoClient.connect(mongoUrl)
      let schema = getSchema(db)
      app.use('/graphql', graphqlHTTP({
        schema,
        graphiql: true
      }))
      app.listen(3000, () => console.log("Connected to Mongo \nListening on port 3k"))

      //Generate graphql schema json
      let json = await graphql(schema, introspectionQuery)
      fs.writeFile('schema.json', JSON.stringify(json, null, 2))
    } catch (e) {
      throw e
    }
  }
)()
