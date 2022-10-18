import { elementsProvider } from '../../utils/domUtils.js'
import storeUtils from '../redux/storeUtils.js'
import Immutable from 'immutable'
import * as d3 from 'd3'
import setupParsetFunction from '../parallelSets/d3.parsets'
import d3v3 from '../parallelSets/d3v3'



setupParsetFunction(d3v3)


let viewState = Immutable.Map({})

export default () => {
  const innerRender = () => {
    const connectStates = ['path', 'comparison']

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
  hideLoader()
  renderTable()
}

const hideLoader = () => {
  const selector = elementsProvider.LOADER_SECTION
  d3.select(selector).attr("style", "display: none;")
}


const renderTable= () => {
  const selector = elementsProvider.PATHS
  const selector1 = elementsProvider.PATHSM1
  const selector2 = elementsProvider.PATHSM2
 
  const value = renderValue(selector)
  const value1 = renderValue(selector1)
  const value2 = renderValue(selector2)
  const height = getHeight()

  if (value!= undefined){
    renderRowColumn(value, selector, "principal",height)
    renderRowColumn(value1, selector1, "otro",height)
    renderRowColumnComparison(value2, selector2,height)
  } 
}

const getHeight = () => {
  const height = (d3v3.select(elementsProvider.CONTAINER).node().getBoundingClientRect().height*10)/100
  return height
}

const renderRowColumn = (value, selector, value1, height) => {
    var table = d3.select(selector)
                   .append("table")
                   .attr("style", "margin-left: 0px")
                   .attr("height", height )
                   
                   
    var thead = table.append("thead")
    var tbody = table.append("tbody")  
     
     // append the header row
     thead.append("tr")
          .selectAll("th")
          .data(value[1])
          .enter()
          .append("th")
          .attr("style", function() {return value1 == 'principal' ? "font-size: 15px" : "font-size: 10px";})
          .text((column) => column)
   
     // create a row for each object in the data

     tbody.append("tr")
          .selectAll("th")
          .data(value[0])
          .enter()
          .append("th")
          .attr("style", "font-family: Courier")
          .attr("style", function() {return value1 == 'principal' ? "font-size: 15px" : "font-size: 10px";})
          //.style("font-weight", 100)
          .text((row) => row)
}


const renderRowColumnComparison = (value, selector, height) => {
const positive = addColor(value[0], ".")
const title = addColor(value[1], "")

var comparison = getComparison()
var table = d3.select(selector)
               .append("table")
               .attr("style", "margin-left: 0px")
               .attr("height", height )
               
               
var thead = table.append("thead")
var tbody = table.append("tbody")  
 
 // append the header row
 thead.append("tr")
      .selectAll("th")
      .data(title)
      .enter()
      .append("th")
      .attr("style", "font-size: 10px")
      .text((column) => column)

 // create a row for each object in the data
tbody.append("tr")
      .selectAll("th")
      .data(positive)
      .enter()
      .append("th")
      .attr("style", "font-family: Courier")
      .attr("style", "font-size: 10px")
      .style("background-color", function(row) {return row == '.' ? "#00539CFF" : "#fff"})
      .text((row) => {
        return row
      })
  
 const fileNameSpan = d3.select(elementsProvider.SPECIFICVIEW)
 fileNameSpan.text("Specific view:" + value[0][0])

      
if(comparison){
  var fileNameSpan_ = d3.select(elementsProvider.SPECIFICVIEW)
  const negativeValue = oppositeValuefunction(value[0][0])
  fileNameSpan_.text("Specific view: " + value[0][0] + " vs." + negativeValue)
 var negative = addColor2(value[0], ".", negativeValue)
  tbody.append("tr")
      .selectAll("th")
      .data(negative)
      .enter()
      .append("th")
      .attr("style", "font-family: Courier")
      .attr("style", "font-size: 10px")
      .style("background-color", function(row) {return row == '.' ? "#EEA47FFF" : "#fff"})
      .text((row) => row)
}
}


const addColor = (value, string) => {
  var color = []
  color.push(string)
  return color.concat(value)
}

const addColor2 = (value, string, negativeValue) => {
  var color = []
  color.push(string)
  color.push(negativeValue)
  for (var i = 1; i < value.length; i++){
      color.push(value[i])
  }
  return color
}

const renderValue = (selector) =>{
  var table1 = d3.select(selector)
      table1.select("table").remove()
  
  const ribbonPath_ = d3.select(elementsProvider.PATHS)
  ribbonPath_.select("text").remove()
  const ribbonPath = viewState.get('path')
  const iterator = ribbonPath.values()
  return iterator.next().value
}
  

const getComparison = ()=>{
  const attribute = viewState.get('comparison')
  if (attribute.size!=0)
    return true
  else
    return false
}

const oppositeValuefunction = (value) =>{
  if(value === 'TP'){
    return 'FN'
  }
  else{
    if(value === 'FN')
       return 'TP'
    else{
     if(value === 'FP')
        return 'TN'
     else{
       if(value === 'TN')
         return 'FP'
     }
    }
  }
}