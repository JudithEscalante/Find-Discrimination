import { elementsProvider } from '../../utils/domUtils.js'
import storeUtils from '../redux/storeUtils.js'
import actions_ from './actions.js'
//import actions from '../parallelSets/actions_.js'
import Immutable from 'immutable'
import * as d3 from 'd3'

let viewState = Immutable.Map({})

export default () => {
  const innerRender = () => {
    const connectStates = ['dataset', 'featuresFilter','modelFilter','protectedAttribute']

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

const  getdimensionClever = (discriminationAttribute, dimensionsToFilter) => { 
  return  discriminationAttribute.filter((dimension) => dimensionsToFilter.includes(dimension))

}

const render = () => {
  const dataset = viewState.get('dataset')
 
  const features = getEntryFeatures(dataset)
  const featuresEspecial= getEntryFeaturesEspecial(dataset)
  const discriminationAttribute = getFeatureProtected(featuresEspecial)
   
  
  var list = viewState.get('protectedAttribute')
  var protectedAttribute = getdimensionClever(discriminationAttribute, list) 
  renderSideBar(elementsProvider.SIDEBAR_OPTIONS, features, discriminationAttribute, protectedAttribute)
  

}





const renderSideBar = (selector, features, discriminationAttribute, protectedAttribute) => {
  const sidebar = d3.select(selector)

  const options = sidebar
    .selectAll("input")
    .data(features)
    .enter()
    .append("div")
    .attr("class", "option")
    
  renderCheckboxes(options, discriminationAttribute)
  renderLabels(options, protectedAttribute)
}

const renderCheckboxes = (options, discriminationAttribute) => {
  options
    .append("input")
      .attr("type", "checkbox")
      .attr("checked", function(d) {return check(d, discriminationAttribute) ? true : null;})
      .attr("id", (d) => d)
      .on("click", (featureName) => {
        return toggleFeature(featureName)
      })
}


const renderLabels = (options, protectedAttributes) => {
  
  options
    .append("label")
      .attr("class", "tooltipped")
      .attr("data-position", "right")
      .attr("data-delay", 50)
      .style("color", function(d) {return check(d, protectedAttributes) ? "white" : "#9e9e9e";})
      .attr("data-tooltip", (d) => d)
      .attr("for", (d) => d)
      .text((d) => d)
      

  initTooltips()
}

const initTooltips = () => {
  $('.tooltipped').tooltip({delay: 50})
}

const toggleFeature = (featureName) => {
  storeUtils.dispatch(actions_.toggleSidebarFilter(featureName))
}

const check = (d, discriminationAttribute) =>{
  for (var i = 0; i < discriminationAttribute.length; i++){
    if(discriminationAttribute[i] == d){
      return true
    }  
  }
  return false
}

const getEntryFeatures = (dataset) => {
  var features = Object.keys(dataset.get(0))
  for (var i = 0; i < features.length; i++){
    if(features[i] == 'Models')
         features.splice(i, 1)
  }
  return features
}


const getFeatureProtected = (featuresEspecial) => {
 
  var data1 = ['NameClassification', 'age', 'workclass', 'education', 'marital-status', 'race', 'sex', 'hours-per-week', 'country', 'Models']
  
  if (data1.length == compareFeature(featuresEspecial,data1)){
     var protectedAttribute = ['NameClassification','sex', 'age', 'workclass']
     return protectedAttribute
  }
}

const getEntryFeaturesEspecial = (dataset) => {
  var featuresEspecial = Object.keys(dataset.get(0))
  return featuresEspecial
}

const compareFeature = (features, data) =>{
  var size = 0
  for (var a = 0; a < features.length; a++){
    for (var b = 0; b < data.length; b++){
      if(features[a] == data[b]){
           size+=1
      }
    }
  }
  return size
}