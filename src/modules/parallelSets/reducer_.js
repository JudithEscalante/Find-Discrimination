import {TOGGLE_PATH } from './actions_'
import {TOGGLE_PATH_REMOVE } from './actions_'
const Immutable = require('immutable')

const defaultState = Immutable.Set()

const reducer = (state = defaultState, action) => {
  switch(action.type) {
    case TOGGLE_PATH:
      const { path } = action.payload
      state = Immutable.Set()
      return state.add(path)
    case TOGGLE_PATH_REMOVE:
      state = Immutable.Set()
      return state
    default:
      return state
  }
}



export default reducer