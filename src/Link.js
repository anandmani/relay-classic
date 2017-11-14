import React, { PureComponent } from 'react'
import Relay from 'react-relay/classic'

const spanStyle = {
  marginLeft: 10,
  fintSize: 8,
  color: 'grey'
}

class Link extends PureComponent {
  render() {
    console.log("peorps", this.props)
    const hasOptimisticUpdate = this.props.relay.hasOptimisticUpdate(this.props.link)
    const { title, url } = this.props.link
    return (
      <li>
        <a href={url}>{title}</a>
        {
          hasOptimisticUpdate ?
            <span style={spanStyle}>Saving...</span>
            :
            null
        }
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