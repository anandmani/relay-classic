import React, { PureComponent } from 'react'
import API from './API'
// import Store from './data/store'
import actions from './data/actions'
import Relay from 'react-relay/classic'

// const getAppState = () => ({ links: Store.getData() })

class Links extends PureComponent {
  constructor() {
    super()
    // this.state = getAppState()
  }

  // componentDidMount() {
  //   actions.fetchLinks()
  //   Store.on("change", this.onChange)
  // }

  // componentWillUnmount() {
  //   Store.removeListener('change')
  // }

  // onChange = () => {
  //   console.log("3. inside view")
  //   this.setState(getAppState())
  // }

  renderLink = (link) => (
    <li key={link._id}>
      <a href={link.url}>{link.title}</a>
    </li>
  )

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
            title,
            url
          }
        }
      `
  }
})

export default Links