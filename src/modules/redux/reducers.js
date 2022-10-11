import { combineReducers, createStore, compose } from 'redux'
import featuresFilter from '../sidebar/reducer.js'
import modelFilter from '../sidebarmodel/reducer.js'
import dataset from '../dataReader/reducer.js'
import storeUtils from './storeUtils.js'
import comparison from '../comparison/reducer.js'
import protectedAttribute from '../protectedAttribute/reducer.js'
import path from '../parallelSets/reducer_'

export default () => {
  const rootReducer = combineReducers({
    featuresFilter,
    modelFilter,
    path,
    dataset,
    comparison,
    protectedAttribute
  })

  const store = createStore(
    rootReducer,
    compose(
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  )

  storeUtils.init(store)

  return store
}
