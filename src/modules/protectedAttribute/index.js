import { elementsProvider } from '../../utils/domUtils.js'
import storeUtils from '../redux/storeUtils.js'
import actions from './actions.js'
import Immutable from 'immutable'
import * as d3 from 'd3'


let viewState = Immutable.Map({})

export default () => {
  const innerRender = () => {
    const connectStates = ['dataset']

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
  const dataset = viewState.get('dataset')
  const features =  getEntryFeatures(dataset)
  const showFeatures = showAttribute(features)
 
  renderButton(elementsProvider.SELECTBUTTON, showFeatures)
  
 
}

const renderButton = (selector, showFeatures) => {
  var bool=false
  const sidebar = d3.select(selector)
                    .append('div')
                    .attr('class','dropdown')
  sidebar.append('button')
         .attr('type','button')
         .style("background", '#26a69a')
         .style("border-color", '#04AA6D')
         .style("border", '2px solid #04AA6D')
         .style("color", 'white')
         .style("border-radius", '5px')
         .style("padding", '4px 8px')
         .text('Protected attribute')
         .on("click", () => {
           if(bool){
            bool = false
            //renderOption(features)
            $(elementsProvider.OPTIONPROTECTED).hide()
           }
           else{
             bool=true
             $(elementsProvider.OPTIONPROTECTED).show()
             //renderSVG()
           }  
         })
    renderOption(showFeatures) 
  
  

}

const renderSVG = () => {
  const options = d3.select(elementsProvider.OPTIONPROTECTED)
  options.selectAll("input").remove()
  options.selectAll("label").remove()
}

const renderOption = (features) => {
  
  const options =  d3.select(elementsProvider.OPTIONPROTECTED)
    .selectAll("input")
    .data(features)
    .enter()
    .append("div")
    .attr("class", "option")

  renderCheckboxes(options)
  renderLabels(options)
}

const renderCheckboxes = (options) => {
  options
    .append("input")
      .attr("type", "checkbox")
      .attr("id", (d) => d)
      .on("click", (protectedAttribute) => {
        return toggleFeature(protectedAttribute)
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

const toggleFeature = (featureName) => {
  storeUtils.dispatch(actions.toggleSidebarProtected(featureName.replace(/\s+/g, '')))
}

  

const getEntryFeatures = (dataset) => {
    var features = Object.keys(dataset.get(0))
    return getFeatureProtected(features)
}

const getFeatureProtected = (features) => {
 
  var data1 = ['NameClassification', 'age', 'workclass', 'education', 'marital-status', 'race', 'sex', 'hours-per-week', 'country', 'Models']
  
  if (data1.length == compareFeature(features,data1)){
     var protectedAttribute = ['sex', 'age', 'workclass']
     return protectedAttribute
  }
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

const showAttribute = (features) => {
  for (var i = 0; i < features.length; i++){
    features[i] = features[i] + ' '
  }
  return features
}



    