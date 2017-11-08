import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import Links from './Links'

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