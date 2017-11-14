import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLID,
  GraphQLNonNull
} from 'graphql'

import {
  globalIdField,
  connectionDefinitions,
  connectionArgs,
  connectionFromPromisedArray,
  mutationWithClientMutationId,
  nodeDefinitions,
  fromGlobalId
} from 'graphql-relay'

const getSchema = (db) => {
  let store = {}

  let { nodeInterface, nodeField } = nodeDefinitions(
    (globalId) => {
      let { type } = fromGlobalId(globalId)
      if (type == 'Store') {
        return store
      }
      return null
    },
    (obj) => storeType
  )

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
    interfaces: [nodeInterface],
    fields: {
      id: globalIdField('Store'),
      linkConnection: {
        type: linkConnection.connectionType,
        args: { ...connectionArgs, search: { type: GraphQLString } },
        resolve: (_, args) => {
          let { search } = args
          let findObj = {}
          if (search) {
            findObj.title = new RegExp(search, 'i')
          }
          return connectionFromPromisedArray(
            db.collection("links").find(findObj).toArray()
              .then((links) => links)
              .catch(err => { throw err }),
            args
          )
        }
      }
    }
  })

  let queryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
      node: nodeField,
      store: {
        type: storeType,
        resolve: () => store
      }
    }
  })

  /*
  Graphiql: 

    mutation addLinkMutation($input:AddLinkInput!){
      addLink(input: $input){
        linkEdge{
          cursor
          node{
            id
            title
            url   
          }
        }
        clientMutationId
      }
    }

    Query variables: 
    {
      "input": {
        "title" : "relay-1",
        "url": "relay-1"
      }
    }

  */

  //Relay mutation
  let addLinkMutation = mutationWithClientMutationId({
    name: 'AddLink',
    inputFields: {
      title: { type: new GraphQLNonNull(GraphQLString) },
      url: { type: new GraphQLNonNull(GraphQLString) }
    },
    outputFields: {
      linkEdge: {
        type: linkConnection.edgeType,
        resolve: (response) => ({ node: response.ops[0], cursor: response.insertedId })
      },
      store: {
        type: storeType,
        resolve: () => storeType
      }
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