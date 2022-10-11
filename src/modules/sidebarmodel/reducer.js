import {TOGGLE_SIDEBAR_MODEL } from './actions'

const Immutable = require('immutable')

const defaultState = Immutable.Set()

const reducer = (state = defaultState, action) => {
  switch(action.type) {
    case TOGGLE_SIDEBAR_MODEL:
      const { modelName } = action.payload
      state = Immutable.Set()
      return state.add(modelName)
    default:
      return state
  }
}

export default reducer








