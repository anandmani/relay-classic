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
  connectionFromPromisedArray,
  mutationWithClientMutationId
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
      linkConnection: {
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

  //Relay mutation
  let addLinkMutation = mutationWithClientMutationId({
    name: 'AddLink',
    inputFields: {
      title: { type: new GraphQLNonNull(GraphQLString) },
      url: { type: new GraphQLNonNull(GraphQLString) }
    },
    outputFields: {
      link: {
        type: linkType,
        resolve: (response) => response.ops[0]
      },
    },
    mutateAndGetPayload: ({ title, url }) => db.collection("links").insertOne({ url, title })
  })

  let mutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      addLink: addLinkMutation
    }
  })

  //Graphql mutation
  // let mutationType = new GraphQLObjectType({
  //   name: 'Mutation',
  //   fields: {
  //     addLink: {
  //       type: linkType,
  //       args: {
  //         url: { type: GraphQLString },
  //         title: { type: GraphQLString }
  //       },
  //       resolve: async (_, { url, title }) => {
  //         let response = await db.collection("links").insertOne({
  //           url,
  //           title
  //         })
  //         response = response.ops[0]
  //         response.id = response._id
  //         return response
  //       }
  //     }
  //   }
  // })

  const schema = new GraphQLSchema({
    query: queryType,
    mutation: mutationType
  })

  return schema
}


export default getSchema