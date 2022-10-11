import { elementsProvider } from '../../utils/domUtils.js'
import storeUtils from '../redux/storeUtils.js'
import Immutable from 'immutable'
import * as d3 from 'd3'


let viewState = Immutable.Map({})

export default () => {
  const innerRender = () => {
    const connectStates = ['dataset','path','modelFilter','category', 'comparison']

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
    renderDonutChart(elementsProvider.DONUT_CHART, dataset)
    
}


const dataDonut = (datamodel) => {
    const way = getPath()
    if(way!=undefined){
        const category = way[1]
        const path = way[0]
        var data = []
        var features =[]
        var leaf = 1
        data = dataCategory(datamodel, path[0])

        for (var i = 0; i < category.length; i++) {
            var feature = getUnique(data, category[i])
            leaf = leaf*feature.length
            features.push(feature)
        }
       
        var modifiedFeatures = features
        var allPaths = allCombinations(modifiedFeatures)
        var level = features.length
        
        for (var k = 0; k < features.length; k++) {
            var paths = allCombinations(modifiedFeatures)
            var count = 0
            var generalList = []
            var sublist = []
            var lenfeatures = modifiedFeatures.length
            for (var i = 0; i < allPaths.length; i++) {
                count +=1
                var j = paths[i].length - 1
                if (level == features.length){
                    var node = {"nodeData": {
                        "path": paths[i],
                        "name": paths[i][j],
                        //"featurename": category[i],
                        "value": countItem(paths[i], data)
                    }}
                }
                else{
                    var node = {"nodeData": {
                        "path": paths[i],
                        "name": paths[i][j],
                        //"featurename": category[i],
                        "value": countItem(paths[i], data)
                    },
                    "subData": allPaths[i]
                    }
                }   
                sublist.push(node)
                if(count == modifiedFeatures[lenfeatures-1].length){
                    generalList.push(sublist)
                    count=0
                    sublist=[]
                }

            }
            allPaths = generalList 
            modifiedFeatures = removeLastItem(modifiedFeatures)
            level--
            
        }
        return allPaths 
   }
}

const getWidth = () => {
    const width = ((d3.select(elementsProvider.CONTAINER).node().getBoundingClientRect().width *75)/100)/2 
    return width
  } 
  
  const getHeight = () => {
  const height = (d3.select(elementsProvider.CONTAINER).node().getBoundingClientRect().height *75)/100 - 56 - (d3.select(elementsProvider.CONTAINER).node().getBoundingClientRect().height *15)/100
  return height
  } 

const renderDonutChart = (selector, dataset) => {

  const model = getDataModel(selector)
  const datamodel = dataModel(dataset, model)
  const data = dataDonut(datamodel)
  const width = getWidth()
  const height = getHeight()
  var radiusDonut = 0
  if(width>height){
     radiusDonut = height
  }
  else{
     radiusDonut = width
  }
  const maxRadius = radiusDonut / 2
  const svg = d3.select(selector)
      .append("svg")
      .attr("width", radiusDonut)
      .attr("height", radiusDonut)
      .append("g")
      .attr("transform", "translate(" + radiusDonut / 2 + "," + radiusDonut / 2 + ")") 
  
  const tooldiv = d3.select(selector)
      .append("div") 
      .style("visibility", "hidden")
      .style('position', 'absolute')
      .style('background-color', '#ffffff')
      .style('opacity', .7)
      .attr("class", "parsets tooltip");

  if(data!=undefined){
    const multiLevelData = setMultiLevelData(data[0])
    const way = getPath()
    const comparisonValue = getComparison()
    var feature_ =[]
    var oppositeValue = ''
    var oppositeFeature = []
    if(way!=undefined){
        feature_ = way[0]
        if(comparisonValue){
            oppositeValue = oppositeValuefunction (feature_[0])
            oppositeFeature = changeCategory(feature_, oppositeValue)
        }
    }
    
    
    var pieWidth = parseInt(maxRadius / multiLevelData.length) - multiLevelData.length;
    var colorStart = ["#E0BBE4", "#FEC8D8", "#a8d3b7", "#f7efc0", "#eea4a7", "#C3C1E6", "#EEE8AB", "#C09ADB", "#909FB6", "#E0BBE4"]
    var colorEnd = ["#957DAD", "#FFDFD3", "#d9e5b4", "#f3caa8", "#ac90a9", "#FFD6EF", "#D3A923", "#A17BB9", "#B2C1D6", "#957DAD"]
    var numElement = 1
    for (var i = 0; i < multiLevelData.length; i++) {
       var _cData = multiLevelData[i];
       console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaa", _cData)
       drawPieChart(tooldiv, _cData, i, svg, pieWidth, colorStart[i], colorEnd[i], feature_, numElement, oppositeFeature,radiusDonut);
       numElement+=1
    }
  }
  

}

const changeCategory = (feature_, oppositeValue) =>{
    var newFeature=[]
    for (var i = 0; i < feature_.length; i++) {
        if (i==0){
            newFeature.push(oppositeValue)
        }
        else{
            newFeature.push(feature_[i])
        }
           
    }
    return newFeature

}

const setMultiLevelData = (data) => {
    var multiLevelData = []
    if (data == null)
        return
    var level = data.length
    var counter = 0
    var index = 0
    var currentLevelData = []
    var queue = []
    for (var i = 0; i < data.length; i++) {
        queue.push(data[i])
    }
    
    while (!queue.length == 0) {
        var node = queue.shift()
            currentLevelData.push(node)
            level--

        if (node.subData) {
            for (var i = 0; i < node.subData.length; i++) {
                queue.push(node.subData[i])
                counter++
            }
        }
        if (level == 0) {
            level = counter
            counter = 0          
            multiLevelData.push(currentLevelData)
            currentLevelData = []
        }
        
    }
    
    return multiLevelData
}


const array = (feature_, numElement) => {
    var template=[]
    for (var i = 0; i < numElement; i++) {
        template.push(feature_[i])
    }
    return template
}

const arrayCompare = (array1, array2) => {
    return array1.equals(array2)
}

const drawPieChart = (tooldiv, _data, index, svg, pieWidth, colorStart, colorEnd, feature_, numElement, oppositeFeature, radiusDonut) => {
  
  const color = d3.scaleSequential()      
        .interpolator(d3.interpolateRgb(colorStart, colorEnd))      
        .domain([0, _data.length])
  const pie = d3.pie()
      .sort(null)
      .value((d) => d.nodeData.value)
      
  const arc = d3.arc()
      .outerRadius((index + 1) * pieWidth - 1)
      .innerRadius(index * pieWidth)

  const g = svg.selectAll(".arc" + index)
      .data(pie(_data))
      .enter()
      .append("g")
      .attr("class", "arc" + index)
      
  var value_= 0
  g.append("path")
   .attr("d", arc)
   .style("fill", (d) => {
        var array1= d.data.nodeData.path
        var array2= array(feature_, numElement)
        var array3= array(oppositeFeature, numElement)
            if (JSON.stringify(array1) == JSON.stringify(array2)) {
                return "#00539CFF"
            } else { 
                if(JSON.stringify(array1) == JSON.stringify(array3)){
                    return "#EEA47FFF"
                }
                else{
                    value_+=1
                    return color(value_)
                }
                }    
    })
    .attr("stroke","white")
    .attr("stroke-width",0.7)
    .on("mouseover",(d) =>{
      tooldiv.style('visibility','visible')
              .html("<b>"+ " Name: " + "</b>" + d.data.nodeData.name + "<br>" + "<b>"+ " Path: " + "</b>" +  d.data.nodeData.path.join(" → ") + "<br>" + "<b>"+ "Quantity: " + "<b>"+ d.data.nodeData.value)
             //.style("font-weight", "bold")
       
    })
    .on("mousemove",() =>{
      tooldiv.style('top', (d3.event.pageY - radiusDonut/3) + 'px' )
              .style('left', (d3.event.pageX - radiusDonut/2) + 'px' )
      
    })
    .on("mouseout",() =>{
      tooldiv.style('visibility','hidden')
    })
    .on("click",(d) =>{
      tooldiv.style('visibility','visible')
      .html("<b>"+ " Name: " + "</b>" + d.data.nodeData.name + "<br>" + "<b>"+ " Path: " + "</b>" +  d.data.nodeData.path.join(" → ") + "<br>" + "<b>"+ "Quantity: " + "<b>"+ d.data.nodeData.value)
    })
      
  //(d) => color(d.data.nodeData.age)
  g.append("text")
   .attr("transform", (d) => "translate(" + arc.centroid(d) + ")")
   .attr("dy", ".25em").style("text-anchor", "middle")
   .style('font-size', '9px')
   .text((d) => d.data.nodeData.value == 0 ? '' : d.data.nodeData.value)

   

}

const initTooltips = () => {
    $('.tooltip').tooltip({delay: 50})
}



const getDataModel = (selector) =>{
    const chart = d3.select(selector)
    chart.select("svg").remove()
    const modeltoFilter = viewState.get('modelFilter')
    const iterator = modeltoFilter.values()
    return iterator.next().value
}

const getPath = () => {
  const ribbonPath = viewState.get('path')
  const iterator = ribbonPath.values()
  const setFeatures = iterator.next().value
  return setFeatures
}

const dataModel = (dataset, model) => {
    const newData = []
    for (var i = 0; i < dataset.size; i++){
      if(dataset.get(i).Models == model){
        newData.push(dataset.get(i))
      }
    }
    if (newData.size !=0) 
       return newData
    else
      return dataset
    
}

const oppositeValuefunction = (value) =>{
    if(value === 'TP'){
      return 'FN'
    }
    else{
      if(value === 'FN')
         return 'TP'
      else{
       if(value === 'FN')
          return 'TN'
       else{
         if(value === 'TN')
           return 'FN'
       }
      }
    }
  }

const dataCategory = (dataset, category) => {
    const comparisonValue = getComparison()
    var category2=''
    if(comparisonValue){
        category2 = oppositeValuefunction(category)
    }
    const newData = []
    for (var i = 0; i < dataset.length; i++){
      if(dataset[i].NameClassification == category){
        newData.push(dataset[i])
      }
      else{
        if(dataset[i].NameClassification == category2){
           newData.push(dataset[i])
        }
      }
    }
    if (newData.size !=0) 
       return newData
    else
      return dataset
    
}

const getComparison = ()=>{
    const attribute = viewState.get('comparison')
    if (attribute.size!=0)
      return true
    else
      return false
}

const getUnique = (arr, index) => {
    var features = []
    var unique = arr
         .map(e => e[index])
         .map((e, i, final) => final.indexOf(e) === i && i)
        .filter(e => arr[e]).map(e => arr[e]);      
   for (var i = 0; i < unique.length; i++) {
            features.push(unique[i][index])
    }
    return features;
}

const allCombinations = (arrays) => {
    const numberOfCombinations = arrays.reduce((res, array) => res * array.length,1)
  
    const result = Array(numberOfCombinations).fill(0).map(() => [])
  
    let repeatEachElement
  
    for (let i = 0; i < arrays.length; i++) {
      const array = arrays[i]
      repeatEachElement = repeatEachElement ? repeatEachElement / array.length : numberOfCombinations / array.length
  
      const everyElementRepeatedLength = repeatEachElement * array.length
  
      for (let j = 0; j < numberOfCombinations; j++) {
        const index = Math.floor(
          (j % everyElementRepeatedLength) / repeatEachElement
        )
        result[j][i] = array[index]
      }
    }
  
    return result
  } 

const removeLastItem = (feature) =>{
    var newRemove = []
    for (var i = 0; i < feature.length - 1; i++){
        newRemove.push(feature[i])
    }
    return newRemove
}
    
const listPath = (setFeatures,someMap) =>{
    var cont=0
    for (var i = 0; i < setFeatures.length; i++){
      for(var j in someMap){
        if(setFeatures[i]==someMap[j])
           cont+=1
       }
    }
    if (cont==setFeatures.length)
       return 1
    else
       return 0
}

const countItem = (setFeatures, data) => {
    var total=0
    for (var i = 0; i < data.length; i++){
       total+=listPath(setFeatures, data[i])
    }
    return total
}


  
  






  
