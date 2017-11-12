import actionTypes from './actionTypes'
import dispatcher from './dispatcher'
import { parseResponse } from '../utils'

const actions = {
  fetchLinks: () => {
    console.log("1. inside action")
    fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: "{ links {_id, title, url} }"
      })
    })
      .then(parseResponse)
      .then(response => {
        dispatcher.dispatch({
          type: actionTypes.FETCH_LINKS,
          data: response.data.links
        })
      })
  }
}

export default actions