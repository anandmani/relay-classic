import React, { PureComponent } from 'react'
import API from './API'
import actions from './data/actions'
import Relay from 'react-relay/classic'
import Link from './Link'
import AddLinksMutation from './mutations/AddLinksMutation'

const spanStyle = {
  marginRight: 10
}

class Links extends PureComponent {

  renderLink = (edge) => {
    const { node } = edge
    return <Link key={node.id} link={node} />
  }

  handleChange = (e) => {
    const value = e.target.value
    console.log("value", value)
    this.props.relay.setVariables({
      limit: value
    })
  }

  handleAddSubmit = (e) => {
    e.preventDefault()
    this.props.relay.commitUpdate(
      new AddLinksMutation({
        title: this.refs.titleInput.value,
        url: this.refs.urlInput.value,
        store: this.props.store
      })
    )
    this.refs.titleInput.value = ''
    this.refs.urlInput.value = ''
  }

  handleSearch = (e) => {
    const value = e.target.value
    this.props.relay.setVariables({
      search: value
    })
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleAddSubmit}>
          <span style={spanStyle}>Add Link</span>
          <input ref='titleInput' placeholder='title' />
          <input ref='urlInput' placeholder='url' />
          <button type='submit'>submit</button>
        </form>
        <br />
        <input onChange={this.handleSearch} defaultValue={this.props.relay.variables.search} placeholder='Search' />
        <select onChange={this.handleChange} defaultValue={this.props.relay.variables.limit}>
          <option value={2}>2</option>
          <option value={10}>10</option>
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
    limit: 2,
    search: ''
  },
  fragments: {
    store: () => Relay.QL`
        fragment on Store{
          id,
          linkConnection(first: $limit, search: $search){
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