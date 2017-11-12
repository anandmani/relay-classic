import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import Links from './Links'
import Relay from 'react-relay'

class App extends PureComponent {
  render() {
    return (
      <div>
        <Links />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('react'))

console.log("relay",
  Relay.QL`
  query Test{
    getLinks{
      title
    }
  }
  `
)