import { GraphQLSchema, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList } from 'graphql'


let linkType = new GraphQLObjectType({
  name: 'Link',
  fields: {
    '_id': { type: GraphQLString },
    'title': { type: GraphQLString },
    'url': { type: GraphQLString }
  }
})

let queryType = (db) => new GraphQLObjectType({
  name: 'Query',
  fields: {
    getLinks: {
      type: new GraphQLList(linkType),
      resolve: () => (
        db.collection("links").find({}).toArray()
          .then((links) => links)
          .catch(err => { throw err })
      )
    }
  }
})

const getSchema = (db) => {
  const schema = new GraphQLSchema({
    query: queryType(db)
  })
  return schema
}

export default getSchema