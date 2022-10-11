import { elementsProvider } from '../../utils/domUtils.js'
import setupParsetFunction from './d3.parsets'
import storeUtils from '../redux/storeUtils.js'
import Immutable from 'immutable'
import './d3.parsets.scss'
import d3v3 from './d3v3'
import actions from './actions.js'


setupParsetFunction(d3v3)

const parallelSetChart = d3v3.parsets()
let viewState = Immutable.Map({})

export default (data) => {
  const innerRender = () => {
    const connectStates = ['dataset', 'featuresFilter','modelFilter','path']

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

  hideLoader()
  renderParallelSet(dataset)
}

const hideLoader = () => {
  const selector = elementsProvider.LOADER_SECTION
  d3.select(selector).attr("style", "display: none;")
}

const renderParallelSet = (dataset) => {
  //if(viewState.get('path').size == 1){
    //openModal()
  //}
  const width = getWidth()
  const height = getHeight()
  const svg = reloadSvg(width, height)
  renderParset(dataset, width, svg, height)
}
const openModal = () => {
  $('#modal1').modal('open')
}

function removeItemFromArr( arr, item ) {
  return arr.filter( function( e ) {
      return e !== item;
  } )
}

const renderParset = (dataset, width, svg, height) => {
  //const featuresEspecial= getEntryFeaturesEspecial(dataset)
  //const discriminationAttribute = getFeatureProtected(featuresEspecial)
  //var list = viewState.get('protectedAttribute')
  //var protectedAttribute = getdimensionClever2(discriminationAttribute, list) 
  const dimension = getDimensions(dataset)
  const model = getDataModel()
  parallelSetChart.dimensions(removeItemFromArr(dimension,'Models'))
  //parallelSetChart.protectedr(protectedAttribute)
  parallelSetChart.width(width)
  
  //parallelSetChart.height(height)
  const datamodel = parallelSetModel(dataset, model)
  svg.datum(datamodel).call(parallelSetChart)
  
}



const parallelSetModel = (dataset, model) => {
  const newData = []
  for (var i = 0; i < dataset.size; i++){
    if(dataset.get(i).Models == model){
      newData.push(dataset.get(i))
    }
  }
  if (newData.size !=0) 
     return newData
  else{
    return dataset
  }
}

const getDataModel = (dataset) =>{
  const modeltoFilter1= viewState.get('modelFilter')
  if (!modeltoFilter1.contains('Agglomerative-Clustering') && modeltoFilter1.size===0) {
    storeUtils.dispatch(actions.toggleSidebarModel('Agglomerative-Clustering'))
    const modeltoFilter= viewState.get('modelFilter')
    const iterator = modeltoFilter.values()
    return iterator.next().value
    
    
  }
  else{
    const modeltoFilter = viewState.get('modelFilter')
    const iterator = modeltoFilter.values()
    return iterator.next().value
    
  }
}

const compareClever = (list1,list2) => {
  var listC=[]
  for (var a = 0; a < list1.length; a++){
    for (var b = 0; b < list2.length; b++){
      if(list1[a] != list2[b]){
           listC.push(list1[a])
      }
    }
  }
  return listC
}

const removeDuplicate = (clever, id) => {
  var size=0
  for (var a = 0; a < clever.length; a++){
     if(clever[a]==id){
       size+=1
     }
  }
  return size
}

const  getdimensionClever = (allDimensions, dimensionsToFilter) => { 
  var listClever=[]
  var clever=[]
  dimensionsToFilter.map((item) =>{listClever.push(item.toString())})
  clever=[...listClever, ...allDimensions]
  var withoutRepeat =[]
  for (var a = 0; a < clever.length; a++){
     if(removeDuplicate(clever,clever[a])==1){
      withoutRepeat.push(clever[a])
     }
  }
  var first = "NameClassification";
  withoutRepeat.sort(function(x,y){ return x == first ? -1 : y == first ? 1 : 0; })
  return withoutRepeat

}




const getDimensions = (dataset) => {
  const allDimensions_ = getEntryFeaturesEspecial(dataset)
  const allDimensions = getFeatureProtected(allDimensions_)
  const dimensionsToFilter = viewState.get('featuresFilter')
  
  return getdimensionClever(allDimensions, dimensionsToFilter) 
}

const getWidth = () => {
  const width = d3v3.select(elementsProvider.PARALLEL_SET_CONTAINER).node().getBoundingClientRect().width - 30
  return width
}

const getHeight = () => {
  const height = (d3v3.select(elementsProvider.CONTAINER).node().getBoundingClientRect().height*70)/100
  return height
}

const reloadSvg = (width, height) => {
  const parallelSetChartContent = d3v3.select(elementsProvider.PARALLEL_SET_CONTENT)
  parallelSetChartContent.select("svg").remove()
  var svg = parallelSetChartContent.append("svg")
    .attr("width", width)
    .attr("height", parallelSetChart.height())
    //
  return svg
}


const getEntryFeaturesEspecial = (dataset) => {
  var featuresEspecial = Object.keys(dataset.get(0))
  return featuresEspecial
}


const getFeatureProtected = (featuresEspecial) => {
 
  var data1 = ['NameClassification', 'age', 'workclass', 'education', 'marital-status', 'race', 'sex', 'hours-per-week', 'country', 'Models']
  
  if (data1.length == compareFeature(featuresEspecial,data1)){
     var protectedAttribute = ['NameClassification','sex', 'age', 'workclass']
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


const  getdimensionClever2 = (discriminationAttribute, dimensionsToFilter) => { 
  return  discriminationAttribute.filter((dimension) => dimensionsToFilter.includes(dimension))

}