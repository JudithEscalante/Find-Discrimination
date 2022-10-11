import { elementsProvider } from '../../utils/domUtils.js'
import storeUtils from '../redux/storeUtils.js'
import actions from './actions.js'
import Immutable from 'immutable'
import * as d3 from 'd3'

let viewState = Immutable.Map({})

export default () => {
  const innerRender = () => {
    const connectStates = ['dataset', 'comparison']

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
  
  const comparison_ = ['Comparison']
  const showFeatures = showAttribute(comparison_)
  renderComparison(elementsProvider.COMPARISON, showFeatures)

}
const openModal = () => {
  $('.modal2').modal('open')
}

const renderComparison = (selector, showOption) => {

  

  const checkbox = d3.select(selector)
  const option = checkbox
    .selectAll("input")
    .data(showOption)
    .enter()
    .append("div")
      .attr("class", "col s12")
  renderComparisonOption(option)
  renderLabels(option)
}


const renderComparisonOption = (option) => {
  option
    .append("input")
      .attr("type", "checkbox")
      .attr("id", (d) => d)
      .on("click",   (compare) => {
          //await toggleCompare(compare)
          toggleCompare(compare)
          return;
        //return 
      })
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

const showAttribute = (features) => {
    for (var i = 0; i < features.length; i++){
      features[i] = features[i] + ' '
    }
    return features
}

const   toggleCompare =  (compare) => {
     storeUtils.dispatch(actions.toggleSidebarComparison(compare.replace(/\s+/g, '')))
     
}






