import Relay from 'react-relay/classic'

class AddLinksMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation {addLink}`
  }

  getVariables() {
    return {
      title: this.props.title,
      url: this.props.url
    }
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AddLinkPayload{
        linkEdge,
        store{linkConnection}
      }
    `
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'store',
      parentID: this.props.store.id,
      connectionName: 'linkConnection',
      edgeName: 'linkEdge', //???
      rangeBehaviors: {
        '': 'append'
      }
    }]
  }

  getOptimisticResponse() {
    return {
      linkEdge: {
        node: {
          title: this.props.title,
          url: this.props.url
        }
      }
      //TODO: Why not give store here?
    }
  }
}

export default AddLinksMutation