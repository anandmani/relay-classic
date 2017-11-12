import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLID,
  GraphQLNonNull
} from 'graphql'

import {
  connectionDefinitions,
  connectionArgs,
  connectionFromPromisedArray
} from 'graphql-relay'

const getSchema = (db) => {
  let store = {}

  let linkType = new GraphQLObjectType({
    name: 'Link',
    fields: {
      'id': {
        type: new GraphQLNonNull(GraphQLID),
        resolve: (obj) => obj._id

      },
      'title': { type: GraphQLString },
      'url': { type: GraphQLString }
    }
  })

  let linkConnection = connectionDefinitions({
    name: 'Link',
    nodeType: linkType
  })

  let storeType = new GraphQLObjectType({
    name: 'Store',
    fields: {
      links: {
        type: linkConnection.connectionType,
        args: connectionArgs,
        resolve: (_, args) => (
          connectionFromPromisedArray(
            db.collection("links").find({}).toArray()
              .then((links) => links)
              .catch(err => { throw err }),
            args
          )
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