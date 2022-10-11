import { elementsProvider } from '../../utils/domUtils.js'
import storeUtils from '../redux/storeUtils.js'
//import actions from '../parallelSets/actions_.js'
import actions_ from './actions.js'
import Immutable from 'immutable'
import * as d3 from 'd3'

let viewState = Immutable.Map({})

export default () => {
  const innerRender = () => {
    const connectStates = ['dataset','featuresFilter', 'modelFilter','path']

    if (storeUtils.shouldUpdate(viewState, connectStates)) {
      viewState = storeUtils.updateViewState(viewState, connectStates)
      render()
    }
  }

  const store = storeUtils.getStore()
  d3.select(window).on('resize', render)
  store.subscribe(innerRender)
  innerRender()
}

const render = () => {
  const models = ['Agglomerative-Clustering', 'Decision-Tree', 'Gaussian-Naive-Bayes', 'Kmeans', 'KNN', 'SVM']
  renderSideBarModel(elementsProvider.SIDEBAR_OPTIONS_MODEL, models)


}

const renderSideBarModel = (selector, models) => { 
  
      const sidebar= d3.select(selector)
      const options = sidebar
            .selectAll("input")
            .data(models)
            .enter()
            .append("div")
              .attr("class", "col s9")
      renderRadio(options)  
      renderLabels(options)
}





const renderRadio = (options) =>{
  options
    .append("input")
      .attr("type", "radio")
      .attr("id", (d) => d)
      .attr("name","model")
      .attr("checked", function(d) {return d == 'Agglomerative-Clustering' ? true : null;})
      .on("click", (modelName) => {
        return toggleModel(modelName)
      })
  
}




const getModelName = (options) =>{
  const modelName = viewState.get('modelFilter')
  const modelNameiterator = modelName.values()
  const general = modelNameiterator.next().values
  return general
     
}


const renderLabels = (options) => {
  options
    .append("label")
      .attr("class", "tooltipped")
      .attr("data-position", "right")
      .attr("data-delay", 50)
      .attr("data-tooltip", (d) => d)
      .attr("for", (d) => d)
      .text((d) => d)

  initTooltips()
}

const initTooltips = () => {
  $('.tooltipped').tooltip({delay: 50})
}


const toggleModel = (modelName) => {
  //storeUtils.dispatch(actions.togglePathDelete())
  storeUtils.dispatch(actions_.toggleSidebarModel(modelName))
}


const getEntryFeatures = (dataset) => {
    return Object.keys(dataset.get(0))
}

const getModels = (dataset) =>{
    return storeUtils.getStore()
}