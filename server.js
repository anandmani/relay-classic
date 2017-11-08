import express from 'express'
import { mongoUrl } from './config'
import { MongoClient } from 'mongodb'

let app = express()
app.use(express.static('public'))

let db
MongoClient.connect(mongoUrl, (err, database) => {
  if (err) throw err
  db = database
  app.listen(3000, () => console.log("Connected to Mongo \nListening on port 3k"))

})

app.get('/data/links', (req, res) => {
  db.collection("links").find({}).toArray((err, links) => {
    if (err) throw err
    res.send(links)
  })
})