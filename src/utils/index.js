export const parseResponse = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response.json().then((body) => {
      return body
    })
  } else {
    return response.text().then((body) => {
      let error = new Error(body)
      throw error
    })
  }
}