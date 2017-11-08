import actionTypes from './actionTypes'
import dispatcher from './dispatcher'
import { parseResponse } from '../utils'

const actions = {
  fetchLinks: () => {
    console.log("1. inside action")
    fetch('/data/links')
      .then(parseResponse)
      .then(response => {
        dispatcher.dispatch({
          type: actionTypes.FETCH_LINKS,
          data: response
        })
      })
  }
}

export default actions