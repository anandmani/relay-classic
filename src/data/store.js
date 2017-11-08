import actionTypes from './actionTypes'
import dispatcher from './dispatcher'
import EventEmitter from 'events'

let links = []

class AppStore extends EventEmitter {
  constructor() {
    super()
    dispatcher.register(this.reduce)
  }
  reduce = (action) => {
    console.log("2. inside store")
    switch (action.type) {
      case actionTypes.FETCH_LINKS:
        links = action.data
        this.emit('change')
        break
      default:
    }
  }
  getData = () => links
}

export default new AppStore() //Note how we are exporting an instance of the class and not the class itself