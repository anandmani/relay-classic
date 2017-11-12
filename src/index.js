import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import Links from './Links'
import Relay from 'react-relay/classic'

class LinksRoute extends Relay.Route {
  static routeName = 'Links'
  static queries = {
    store: (Component) => Relay.QL`
      query LinksQuery {
        store { ${Component.getFragment('store')} }
      }
    `
  }
}

ReactDOM.render(
  <Relay.RootContainer
    Component={Links}
    route={new LinksRoute()}
  />,
  document.getElementById('react')
)