import renderParallelSets from './modules/parallelSets'
import storeProvider from './modules/redux/reducers'
import storeUtils from './modules/redux/storeUtils'
import renderSidebar from './modules/sidebar'
import renderSideBarModel from './modules/sidebarmodel'
import renderModelBar from './modules/modelbar'
import renderUpload from './modules/upload'
import readData from './modules/dataReader'
import renderFaq from './modules/faq'
import renderComparison from './modules/comparison'
import renderFeatureSet from './modules/featuresSet'
import renderDonutChart from './modules/donutChart'
import renderClusteredBar from './modules/clusteredbar'
import renderButtons from './modules/buttons'
import renderProtectedAttribute from './modules/protectedAttribute'
import Immutable from 'immutable'
import './assets/app.scss'

const store = storeProvider()
let innerState = Immutable.Map({})

document.addEventListener('DOMContentLoaded', () => {
  const innerRender = () => {
    const connectStates = ['dataset']

    if (storeUtils.shouldUpdate(innerState, connectStates)) {
      innerState = storeUtils.updateViewState(innerState, connectStates)

      if (storeUtils.getStateElement('dataset').size > 0) {
        render()
      }
    }

    renderIdle()
  }

  const store = storeUtils.getStore()
  store.subscribe(innerRender)
  innerRender()
  closeProtected()
})

const render = () => {
  setTimeout(() => {
    renderSidebar()
    renderSideBarModel()
    renderParallelSets()
    renderFeatureSet()
    renderClusteredBar()
    renderDonutChart()
    renderModelBar()
    renderComparison()
    renderProtectedAttribute()
    renderButtons()
  }, 2000)
}

const renderIdle = () => {
  renderUpload()
  renderFaq()
  
}

const closeProtected = () => {
  $('#optionProtected').hide()
}