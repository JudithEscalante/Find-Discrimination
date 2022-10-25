import { elementsProvider } from '../../utils/domUtils.js'
import storeUtils from '../redux/storeUtils.js'
import actions_ from './actions.js'
//import actions from '../parallelSets/actions_.js'
import Immutable from 'immutable'
import * as d3 from 'd3'

let viewState = Immutable.Map({})

export default () => {
  const innerRender = () => {
    const connectStates = ['dataset', 'featuresFilter','modelFilter']

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
  const modelName = getModelName(elementsProvider.SIDEBAR_OPTIONS)
  const features = getEntryFeatures(dataset)
  const featuresEspecial= getEntryFeaturesEspecial(dataset)
  const discriminationAttribute_ = getFeatureProtected(featuresEspecial, modelName)
  const discriminationAttribute = discriminationAttribute_[0]
  const causalDiscovery = discriminationAttribute_[1]
  //var list = viewState.get('protectedAttribute')
  //var protectedAttribute = getdimensionClever(discriminationAttribute, list) 
  renderSideBar(elementsProvider.SIDEBAR_OPTIONS, features, discriminationAttribute, causalDiscovery)
  

}



const renderSideBar = (selector, features, discriminationAttribute,causalDiscovery) => {
  const sidebar = d3.select(selector)

  const options = sidebar
    .selectAll("input")
    .data(features)
    .enter()
    .append("div")
    .attr("class", "col s12")
    
  renderCheckboxes(options, discriminationAttribute, features)
  renderLabels(options, discriminationAttribute, causalDiscovery, features)
}

const  getdimensionCleve = (discriminationAttribute, dimensionsToFilter) => { 
  var listClever= []
  var filter =[]
  dimensionsToFilter.map((item) =>{listClever.push(item.toString())})
  var clever=[...discriminationAttribute, ...dimensionsToFilter]
  for (var i = 0; i < clever.length; i++){
    if(countFilter(clever, clever[i]) != 2){
      filter.push(clever[i])
    }  
  }
  return filter
}

const countFilter = (list, element) =>{
  var count =0
  for (var i = 0; i < list.length; i++){
    if(list[i]==element){
      count+=1
    }
}
return count
}


const renderCheckboxes = (options, discriminationAttribute, features) => {
  const filter = viewState.get('featuresFilter')
  const filter_= getdimensionCleve(discriminationAttribute, filter)
  options
    .append("input")
      .attr("type", "checkbox")
      .attr("checked", function(d) {return check(d, filter_) ? true : null})
      .attr("id", (d) => d)
      .on("click", (featureName) => {
        return toggleFeature(featureName)
      })

  
      
}


const renderLabels = (options, discriminationAttribute, causalDiscovery ,features) => {
  
  options
    .append("label")
      //.attr("class", "tooltipped")
      //.attr("data-position", "right")
      //.attr("data-delay", 50)
      .style("color", function(d) {return color(d, discriminationAttribute) ? "#26a69a" : "#9e9e9e";})
      .attr("data-tooltip", (d) => d)
      .attr("for", (d) => d)
      //.text((d) => d)
      .text(function(d) {return check(d, discriminationAttribute) ? joinFeature(d, causalDiscovery) : d;})
      

  //initTooltips()
}

const joinFeature = (d, causalDiscovery) => {
   if(causalDiscovery[d]== undefined){
        return d
   }
   else{
    return d + " " + causalDiscovery[d]*100 + "%"
   }
   
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

const color = (d, discriminationAttribute) =>{
  for (var i = 0; i < discriminationAttribute.length; i++){
    if(discriminationAttribute[i] == d && d!= "NameClassification"){
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

const getFeatureProtected = (featuresEspecial, modelName) => {
 
  var data1 = ['NameClassification', 'age', 'workclass', 'education', 'marital-status', 'race', 'sex', 'hours-per-week', 'country', 'Models']
  var data2 = ['NameClassification', 'Relation', 'StageID', 'AbsenceDays', 'gender', 'Semester', 'raisedhands', 'Discussion', 'VisitedResources', 'AcademicAView', 'Models']
  if (data1.length == compareFeature(featuresEspecial,data1)){
    if(modelName == 'Agglomerative-Clustering' || modelName == undefined){
      var protectedAttribute = ['NameClassification','sex', 'age', 'workclass']
      var causalDiscovery = {'sex':0.74, 'age':0.63, 'workclass': 0.86}
      return [protectedAttribute, causalDiscovery]
    }
    else{
      if(modelName == 'Decision-Tree'){
        var protectedAttribute = ['NameClassification','sex', 'age', 'workclass']
        var causalDiscovery = {'sex':0.64, 'age':0.73, 'workclass': 0.83}
        return [protectedAttribute, causalDiscovery]
      }
      else{
        if(modelName == 'Gaussian-Naive-Bayes'){
          var protectedAttribute = ['NameClassification','sex', 'age', 'workclass']
          var causalDiscovery = {'sex':0.54, 'age':0.75, 'workclass': 0.91}
          return [protectedAttribute, causalDiscovery]
        }
        else{
          if(modelName == 'Kmeans'){
            var protectedAttribute = ['NameClassification','sex','workclass']
            var causalDiscovery = {'sex':0.64, 'workclass': 0.83}
            return [protectedAttribute, causalDiscovery]
          }
          else{
            if(modelName == 'KNN'){
              var protectedAttribute = ['NameClassification','sex', 'age', 'workclass', 'hours-per-week']
              var causalDiscovery = {'sex':0.68, 'age':0.78, 'workclass': 0.82, 'hours-per-week': 0.53}
              return [protectedAttribute, causalDiscovery]
            }
            else{
              var protectedAttribute = ['NameClassification','sex', 'age', 'workclass', 'education']
              var causalDiscovery = {'sex':0.76, 'age':0.89, 'workclass': 0.91, 'education': 0.51}
              return [protectedAttribute, causalDiscovery]
            }
          }
        }
      }
    }
     
  }
  else{
    if (data2.length == compareFeature(featuresEspecial,data2)){
      if(modelName == 'Agglomerative-Clustering' || modelName == undefined){
        var protectedAttribute = ['NameClassification','gender', 'Discussion', 'raisedhands']
        var causalDiscovery = {'gender':0.84, 'Discussion':0.53, 'raisedhands': 0.76}
        return [protectedAttribute, causalDiscovery]
      }
      else{
        if(modelName == 'Decision-Tree'){
          var protectedAttribute = ['NameClassification','gender', 'VisitedResources', 'AcademicAView', 'raisedhands']
        var causalDiscovery = {'gender':0.72, 'VisitedResources':0.73, 'AcademicAView':0.68, 'raisedhands': 0.86}
        return [protectedAttribute, causalDiscovery]
        }
        else{
          if(modelName == 'Gaussian-Naive-Bayes'){
            var protectedAttribute = ['NameClassification','gender', 'VisitedResources', 'AcademicAView', 'raisedhands']
        var causalDiscovery = {'gender':0.72, 'VisitedResources':0.63, 'AcademicAView':0.88, 'raisedhands': 0.76}
        return [protectedAttribute, causalDiscovery]
          }
          else{
            if(modelName == 'Kmeans'){
              var protectedAttribute = ['NameClassification','gender', 'raisedhands', 'AcademicAView']
        var causalDiscovery = {'gender':0.72, 'raisedhands': 0.76, 'AcademicAView': 0.74}
        return [protectedAttribute, causalDiscovery]
            }
            else{
              if(modelName == 'KNN'){
                var protectedAttribute = ['NameClassification','gender', 'raisedhands', 'AcademicAView']
                var causalDiscovery = {'gender':0.62, 'raisedhands': 0.86, 'AcademicAView': 0.94}
        return [protectedAttribute, causalDiscovery]
              }
              else{
                var protectedAttribute = ['NameClassification','gender', 'raisedhands', 'AcademicAView']
                var causalDiscovery = {'gender':0.72, 'raisedhands': 0.57, 'AcademicAView': 0.89}
        return [protectedAttribute, causalDiscovery]
              }
            }
          }
        }
      }
    }else{
      return [[],[]]
    }
    
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

const getModelName = (selector) =>{
 const op = d3.select(selector)
   
  op.selectAll("div").remove()
  //chart.selectAll("label").remove()
  const modelName = viewState.get('modelFilter')
  const modelNameiterator = modelName.values()
  return modelNameiterator.next().value
}