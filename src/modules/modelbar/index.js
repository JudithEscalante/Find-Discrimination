import { elementsProvider } from '../../utils/domUtils.js'
import storeUtils from '../redux/storeUtils.js'
import Immutable from 'immutable'
import * as d3 from 'd3'

let viewState = Immutable.Map({})

export default () => {
  const innerRender = () => {
    const connectStates = ['dataset','path','modelFilter', 'comparison']

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
        const modelNameValue = getModelName()
        const features = getPath(elementsProvider.MODEL_BAR)
        if(features!=undefined){
            renderClusteredBar(elementsProvider.MODEL_BAR, features, modelNameValue)
        }
}

const renderClusteredBar = (selector,features, modelNameValue) => {
    
    var plus = features[0][0]
    var minus = ''
    var xAxisTN = ['positivo']
    const comparisonValue = getComparison()
    if(comparisonValue){
        minus = oppositeValue(plus)
        xAxisTN = ['positivo', 'negativo']
    }
    
    var models_ = getmodel(selector, features)
    var models = transformToSet(models_)

    var margin = {'top': 5, 'right': 10, 'bottom': 20, 'left': 10}
    var width = getWidth() + margin.left + margin.right
    var height = getHeight() + margin.bottom + margin.top
    var barPadding = .2
    var axisTicks = {qty: 5, outerSize: 0, dateFormat: '%m-%d'}
    
    
    
    var svg = d3.select(selector)
        .append("svg")
        .attr("width", getWidth() + margin.left + margin.right)
        .attr("height", height )
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          
    const tooldiv = d3.select(selector)
        .append("div") 
        .style("visibility", "hidden")
        .style('position', 'absolute')
        .style('background-color', '#ffffff')
        .style('opacity', .7)
        .attr("class", "parsets tooltip")

    var xScale0 = d3.scaleBand().range([0, width - margin.left - margin.right]).padding(barPadding);
    var xScale1 = d3.scaleBand();
    var yScale = d3.scaleLinear().range([height - margin.top - margin.bottom, 0]);
          
    var xAxis = d3.axisBottom(xScale0).tickSizeOuter(axisTicks.outerSize)    
    var yAxis = d3.axisLeft(yScale).ticks(axisTicks.qty).tickSizeOuter(axisTicks.outerSize);
          
    xScale0.domain(models.map(d => d.abbr));
    xScale1.domain(xAxisTN).range([0, xScale0.bandwidth()]);
    yScale.domain([0, maxValue(models_)])

  var section = svg.selectAll(".section")
   .data(models)
   .enter().append("g")
   .attr("class", "section")
   .attr("transform", d => `translate(${xScale0(d.abbr)},0)`)
   


/* Add positive bars */
section.selectAll(".bar.positivo")
  .data(d => [d])
  .enter()
  .append("rect")
  .attr("class", "bar positivo")
  .style("fill", "#00539CFF")
  .style('opacity', d => {return d.section == modelNameValue ?  1. : .4})
  .attr("x", d => xScale1('positivo'))
  .attr("y", d => yScale(d.positivo))
  .text(d => d.positivo)
  .attr("width", xScale1.bandwidth())
  .attr("height", d => {
    return height - margin.top - margin.bottom - yScale(d.positivo)
  })
  .on("mouseover",(d) =>{
    var elements = document.querySelectorAll(':hover');
    var l = elements.length
        l = l-1
    var activeBar = window.activeBar = elements[l];

    tooldiv.style('visibility','visible')
            .style('background-color', "#00539CFF")
            .html("<b>"+ " Model: " + "</b>" + d.section + "<br>" + 
                  "<b>"+ "Classification: " + "</b>" +  plus + "<br>" + "<b>"+ 
                  "Quantity: " + "<b>"+ d.positivo)
    d3.select(activeBar).attr("stroke","black").attr("stroke-width",1.8)
  })
  .on("mousemove",(d) =>{
    tooldiv.style('top', (d3.event.pageY - height/4) + 'px')
            .style('left', (d3.event.pageX- width/3) + 'px')
             
  })
  .on("mouseout",(d) =>{
    tooldiv.style('visibility','hidden')
    d3.select(window.activeBar).attr("stroke","white").attr("stroke-width",0.0) 
    window.activeBar = {};
  })

section.selectAll(null)
  .data(d => [d])
  .enter().append("text")
  .attr("class", "bar positivo")
  .attr("x", d => xScale1('positivo') + 4)
  .attr("y", d => yScale(d.positivo) + 9)
  .style('font-size', '9px')
  .attr("fill", "#fff")
  .style("font-weight", "bold")
  .text(d => d.positivo)


/* Add negativo bars */

if(comparisonValue){
section.selectAll(".bar.negativo")
.data(d => [d])
.enter()
.append("rect")
.attr("class", "bar negativo")
.style("fill","#EEA47FFF")
.style('opacity', d => {return d.section == modelNameValue ?  1. : .4})
.attr("x", d => xScale1('negativo'))
.attr("y", d => yScale(d.negativo))
.text(d => d.negativo)
.attr("width", xScale1.bandwidth())
.attr("height", d => {
  return height - margin.top - margin.bottom - yScale(d.negativo)
})
.on("mouseover",(d) =>{
  var elements = document.querySelectorAll(':hover');
  var l = elements.length
      l = l-1
  var activeBar = window.activeBar = elements[l];

  tooldiv.style('visibility','visible')
          .style('background-color', "#EEA47FFF")
          .html("<b>"+ " Model: " + "</b>" + d.section + "<br>" + 
                "<b>"+ "Classification: " + "</b>" +  minus + "<br>" + "<b>"+ 
                "Quantity: " + "<b>"+ d.negativo)
  d3.select(activeBar).attr("stroke","black").attr("stroke-width",1.8)
})
.on("mousemove",(d) =>{
  tooldiv.style('top', (d3.event.pageY - height/4) + 'px')
         .style('left', (d3.event.pageX- width/3) + 'px')
           
})
.on("mouseout",(d) =>{
  tooldiv.style('visibility','hidden')
  d3.select(window.activeBar).attr("stroke","white").attr("stroke-width",0.0) 
  window.activeBar = {};
})


section.selectAll(null)
.data(d => [d])
.enter().append("text")
.attr("class", "bar negativo")
.attr("x", d => xScale1('negativo') + 4)
.attr("y", d => yScale(d.negativo) + 9)
.style('font-size', '9px')
.attr("fill", "#fff")
.style("font-weight", "bold")
.text(d => d.negativo)
}



// Add the X Axis
svg.append("g")
   .attr("class", "axis x_axis")
   .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
   .call(xAxis)
   
   

}

const getPath = (selector) => {
    const chart = d3.select(selector)
    chart.select("svg").remove()
    const ribbonPath = viewState.get('path')
    const iterator = ribbonPath.values()
    return iterator.next().value
}

const getmodel = (selector, features) => {
  
  var model = [{
    "section":"Agglomerative-Clustering",
    "abbr": "AC",
    "positivo":0,
    "negativo":0,
    
  },
  {
    "section":"Decision-Tree",
    "abbr": "DT",
    "positivo":0,
    "negativo":0,
  },
  {
    "section":"Gaussian-Naive-Bayes",
    "abbr": "GNB",
    "positivo":0,
    "negativo":0,
  },
  {
    "section":"Kmeans",
    "abbr": "Kmeans",
    "positivo":0,
    "negativo":0,
  },
  {
    "section":"KNN",
    "abbr": "KNN",
    "positivo":0,
    "negativo":0,
  },
  {
    "section":"SVM",
    "abbr":"SVM",
    "positivo":0,
    "negativo":0,
  }]
  
  //const features = getPath(selector)
  
  var setFeatures = features[0]
  const dataset = viewState.get('dataset')
  const comparisonValue = getComparison()
  

  return filterModel(model,setFeatures,dataset, comparisonValue)
}

const setFeaturesOpposite_ = (setFeatures) =>{
  var valueOpposite = oppositeValue(setFeatures[0])
  const setFeaturesOpposite = []
  setFeaturesOpposite.push(valueOpposite)
  for (var i = 1; i < setFeatures.length; i++){
    setFeaturesOpposite.push(setFeatures[i])
  }
  
  return setFeaturesOpposite
}

const filterModel = (model, setFeatures, dataset,comparisonValue) => {

  
  if (comparisonValue){
      var setFeaturesOpposite = setFeaturesOpposite_(setFeatures)
  }

  for (var i = 0; i < dataset.size; i++){
    if(dataset.get(i).Models == 'Agglomerative-Clustering'){
        model[0].positivo+=listPath(setFeatures,dataset.get(i))
        if(comparisonValue){
          model[0].negativo+=listPath(setFeaturesOpposite,dataset.get(i))
        }
    }
    else{
        if(dataset.get(i).Models == 'Decision-Tree'){
            model[1].positivo+=listPath(setFeatures,dataset.get(i))
            if(comparisonValue){
              model[1].negativo+=listPath(setFeaturesOpposite,dataset.get(i))
            }
        }
        else{
            if(dataset.get(i).Models == 'Gaussian-Naive-Bayes'){
                model[2].positivo+=listPath(setFeatures,dataset.get(i))
                if(comparisonValue){
                  model[2].negativo+=listPath(setFeaturesOpposite,dataset.get(i))
                }
            }
            else{
                if(dataset.get(i).Models == 'Kmeans'){
                    model[3].positivo+=listPath(setFeatures,dataset.get(i))
                    if(comparisonValue){
                      model[3].negativo+=listPath(setFeaturesOpposite,dataset.get(i))
                    }
                } 
                else{
                    if(dataset.get(i).Models == 'KNN'){
                        model[4].positivo+=listPath(setFeatures,dataset.get(i))
                        if(comparisonValue){
                          model[4].negativo+=listPath(setFeaturesOpposite,dataset.get(i))
                        }
                    } 
                    else{
                        model[5].positivo+=listPath(setFeatures,dataset.get(i))
                        if(comparisonValue){
                          model[5].negativo+=listPath(setFeaturesOpposite,dataset.get(i))
                        }
                    }
                }
            }
        }
    }
    
  }
  return model
}



const maxValue = (someArray) => {
    var maxValue = 0
    for (var i = 0; i < someArray.length; i++){
      var someMap=someArray[i]
      for(var j in someMap){
        if(Number.isInteger(someMap[j]))
           maxValue = (!maxValue || maxValue < someMap[j]) ? someMap[j] : maxValue
       }
      
    }
    return maxValue;
 
}

const getWidth = () => {
  const width = ((d3.select(elementsProvider.CONTAINER).node().getBoundingClientRect().width *75)/100)/2 - (d3.select(elementsProvider.CONTAINER).node().getBoundingClientRect().width *5)/100
  return width
} 

const getHeight = () => {
const height = (d3.select(elementsProvider.CONTAINER).node().getBoundingClientRect().height *75)/100  - 56  - (d3.select(elementsProvider.CONTAINER).node().getBoundingClientRect().height *15)/100
return height
} 

  
const transformToSet = (otherType) => {
    otherType.map(i => {
          i.section = i.section
          return i
    })
    return otherType
}

const listPath = (setFeatures,someMap) => {
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

const overlappingBars = (modelName,setFeatures,model) => {
  const dataset = viewState.get('dataset')
  for (var i = 0; i < dataset.size; i++){
    if(setFeatures[0] == "TP"){
      if(modelName == 'Agglomerative-Clustering' && dataset.get(i).Models=='Agglomerative-Clustering'){
         model[0].model1_+=listPath(setFeatures,dataset.get(i))
      }
      else{
        if(modelName == 'Decision-Tree' && dataset.get(i).Models=='Decision-Tree'){ 
           model[0].model2_+=listPath(setFeatures,dataset.get(i))
        }
        else{
          if(modelName == 'Gaussian-Naive-Bayes'&& dataset.get(i).Models=='Gaussian-Naive-Bayes'){ 
             model[0].model3_+=listPath(setFeatures,dataset.get(i))
          }
          else{
            if(modelName == 'Kmeans' && dataset.get(i).Models=='Kmeans'){
              model[0].model4_+=listPath(setFeatures,dataset.get(i))
            }
            else{
              if(modelName == 'KNN' && dataset.get(i).Models=='KNN'){
                 model[0].model5_+=listPath(setFeatures,dataset.get(i))
              }
              else{
                if(modelName == 'SVM' && dataset.get(i).Models=='SVM'){
                   model[0].model6_+=listPath(setFeatures,dataset.get(i))
                }
              }  
            }
          }
        }
      }
    }
    else{
      if(setFeatures[0] == "FP"){
        if(modelName == 'Agglomerative-Clustering' && dataset.get(i).Models=='Agglomerative-Clustering'){
          model[1].model1_+=listPath(setFeatures,dataset.get(i))
        }
        else{
          if(modelName == 'Decision-Tree' && dataset.get(i).Models=='Decision-Tree'){
           model[1].model2_+=listPath(setFeatures,dataset.get(i))
          }
          else{
            if(modelName == 'Gaussian-Naive-Bayes' && dataset.get(i).Models=='Gaussian-Naive-Bayes'){ 
              model[1].model3_+=listPath(setFeatures,dataset.get(i))  
            }
            else{
              if(modelName == 'Kmeans' && dataset.get(i).Models=='Kmeans'){
                model[1].model4_+=listPath(setFeatures,dataset.get(i))  
              }
              else{
                if(modelName == 'KNN' && dataset.get(i).Models=='KNN'){
                  model[1].model5_+=listPath(setFeatures,dataset.get(i)) 
                }
                else{
                  if(modelName == 'SVM' && dataset.get(i).Models=='SVM'){
                    model[1].model6_+=listPath(setFeatures,dataset.get(i))  
                  }
                } 
              }
            }
          }
        }
      }
      else{
        if(setFeatures[0] == "FN"){
          if(modelName == 'Agglomerative-Clustering' && dataset.get(i).Models=='Agglomerative-Clustering'){
            model[2].model1_+=listPath(setFeatures,dataset.get(i)) 
          }
          else{
            if(modelName == 'Decision-Tree'  && dataset.get(i).Models=='Decision-Tree'){
              model[2].model2_+=listPath(setFeatures,dataset.get(i)) 
            }
            else{
              if(modelName == 'Gaussian-Naive-Bayes' && dataset.get(i).Models=='Gaussian-Naive-Bayes'){
                model[2].model3_+=listPath(setFeatures,dataset.get(i)) 
              }
              else{
                if(modelName == 'Kmeans' && dataset.get(i).Models=='Kmeans'){
                  model[2].model4_+=listPath(setFeatures,dataset.get(i)) 
                }
                else{
                  if(modelName == 'KNN' && dataset.get(i).Models=='KNN'){
                    model[2].model5_+=listPath(setFeatures,dataset.get(i)) 
                  }
                  else{
                    if(modelName == 'SVM' && dataset.get(i).Models=='SVM'){
                        model[2].model6_+=listPath(setFeatures,dataset.get(i))
                    }
                  } 
                }
              }
            }
          }
        }
        else{
          if(modelName == 'Agglomerative-Clustering'&& dataset.get(i).Models=='Agglomerative-Clustering'){
             model[3].model1_+=listPath(setFeatures,dataset.get(i)) 
          }
          else{
            if(modelName == 'Decision-Tree' && dataset.get(i).Models=='Decision-Tree'){
              model[3].model2_+=listPath(setFeatures,dataset.get(i))
            }
            else{
              if(modelName == 'Gaussian-Naive-Bayes' && dataset.get(i).Models=='Gaussian-Naive-Bayes'){
                model[3].model3_+=listPath(setFeatures,dataset.get(i)) 
              }
              else{
                if(modelName == 'Kmeans'&& dataset.get(i).Models=='Kmeans'){
                  model[3].model4_+=listPath(setFeatures,dataset.get(i)) 
                }
                else{
                  if(modelName == 'KNN'&& dataset.get(i).Models=='KNN'){
                    model[3].model5_+=listPath(setFeatures,dataset.get(i)) 
                  }
                  else{
                    if(modelName == 'SVM' && dataset.get(i).Models=='SVM'){
                      model[3].model6_+=listPath(setFeatures,dataset.get(i)) 
                    }
                  } 
                }
              }
            }
          }
        }
      }
    }
  }
  return model
}
   
const renderClusteredBarChart = (selector,models) => {
    const chart = d3.select(selector)
    chart.select("svg").remove()
    const ribbonPath = viewState.get('path')
    const iterator = ribbonPath.values()
    const setFeatures = iterator.next().value
    const modelNameValue = getModelName()
    if(setFeatures !== undefined){
       return overlappingBars(modelNameValue,setFeatures[0],models)
    }
    else
       return models
}

const getModelName = () =>{
  const modelName = viewState.get('modelFilter')
  const modelNameiterator = modelName.values()
  return modelNameiterator.next().value
}

const getComparison = ()=>{
  const attribute = viewState.get('comparison')
  if (attribute.size!=0)
    return true
  else
    return false
}




const oppositeValue = (value) =>{
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