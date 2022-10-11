import { TOGGLE_SIDEBAR_COMPARISON } from './actions'

const Immutable = require('immutable')

const defaultState = Immutable.Set()

const reducer = (state = defaultState, action) => {
  switch(action.type) {
    case TOGGLE_SIDEBAR_COMPARISON:
      
      const { optionName } = action.payload
      
      if(state.contains(optionName)) {
        return state.remove(optionName)
      }
          
      else {
        return state.add(optionName)}

    default:
      return state
  }
  
}

export default reducer