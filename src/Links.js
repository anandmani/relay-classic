import React, { PureComponent } from 'react'
import API from './API'
import actions from './data/actions'
import Relay from 'react-relay/classic'
import Link from './Link'

class Links extends PureComponent {

  renderLink = (link) => (<Link key={link._id} link={link} />)

  render() {
    console.log("props", this.props.store)
    return (
      <ul>
        {
          this.props.store.links.map(this.renderLink)
        }
      </ul>
    )
  }
}

Links = Relay.createContainer(Links, {
  fragments: {
    store: () => Relay.QL`
        fragment on Store{
          links{
            _id,
            ${Link.getFragment('link')}
          }
        }
      `
  }
})

export default Links