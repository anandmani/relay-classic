import React, { PureComponent } from 'react'
import Relay from 'react-relay/classic'

class Link extends PureComponent {
  render() {
    const { title, url } = this.props.link
    return (
      <li>
        <a href={url}>{title}</a>
      </li>
    )
  }
}

Link = Relay.createContainer(Link, {
  fragments: {
    link: () => (
      Relay.QL`
        fragment on Link{
          title,
          url
        }
        `
    )
  }
})

export default Link