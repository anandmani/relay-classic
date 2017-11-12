import { GraphQLSchema, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList } from 'graphql'

const getSchema = (db) => {
  let store = {}

  let linkType = new GraphQLObjectType({
    name: 'Link',
    fields: {
      '_id': { type: GraphQLString },
      'title': { type: GraphQLString },
      'url': { type: GraphQLString }
    }
  })


  let storeType = new GraphQLObjectType({
    name: 'Store',
    fields: {
      links: {
        type: new GraphQLList(linkType),
        resolve: () => (
          db.collection("links").find({}).toArray()
            .then((links) => links)
            .catch(err => { throw err })
        )
      }
    }
  })

  let queryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
      store: {
        type: storeType,
        resolve: () => store
      }
    }
  })


  const schema = new GraphQLSchema({
    query: queryType
  })

  return schema
}


export default getSchema