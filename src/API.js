import { parseResponse } from './utils'

export default {
  fetchLinks: () => {
    fetch('/data/links')
      .then(parseResponse)
      .then(response => console.log("response is", response))
  }
}