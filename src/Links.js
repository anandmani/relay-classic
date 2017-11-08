import React, { PureComponent } from 'react'
import API from './API'
import Store from './data/store'
import actions from './data/actions'

const getAppState = () => ({ links: Store.getData() })

export default class Links extends PureComponent {
  constructor() {
    super()
    this.state = getAppState()
  }

  componentDidMount() {
    actions.fetchLinks()
    Store.on("change", this.onChange)
  }

  componentWillUnmount() {

  }

  onChange = () => {
    console.log("3. inside view")
    this.setState(getAppState())
  }

  renderLink = (link) => (
    <li key={link._id}>
      <a href={link.url}>{link.title}</a>
    </li>
  )

  render() {
    return (
      <ul>
        {this.state.links.map(this.renderLink)}
      </ul>
    )
  }
}