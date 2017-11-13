import React, { PureComponent } from 'react'
import API from './API'
import actions from './data/actions'
import Relay from 'react-relay/classic'
import Link from './Link'

class Links extends PureComponent {

  renderLink = (edge) => {
    console.log("edge is", edge)
    const { node } = edge
    return <Link key={node.id} link={node} />
  }

  handleChange = (e) => {
    const value = e.target.value
    this.props.relay.setVariables({
      limit: value
    })
  }

  render() {
    return (
      <div>
        <select onChange={this.handleChange}>
          <option value={2}>2</option>
          <option value={10} selected>10</option>
        </select>
        <ul>
          {
            this.props.store.linkConnection.edges.map(this.renderLink)
          }
        </ul>
      </div>
    )
  }
}

Links = Relay.createContainer(Links, {
  initialVariables: {
    limit: 10
  },
  fragments: {
    store: () => Relay.QL`
        fragment on Store{
          linkConnection(first: $limit){
            edges{
              node{
                id,
                ${Link.getFragment('link')}
              }
            }
          }
        }
      `
  }
})

export default Links