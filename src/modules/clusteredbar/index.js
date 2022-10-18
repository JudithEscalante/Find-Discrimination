import { elementsProvider } from '../../utils/domUtils.js'
import storeUtils from '../redux/storeUtils.js'
import Immutable from 'immutable'
import * as d3 from 'd3'




let viewState = Immutable.Map({})

export default () => {
  const innerRender = () => {
    const connectStates = ['dataset','path','modelFilter']

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
    const modelNameValue = getModelName()
    const feature = getEntryFeaturesEspecial(dataset)
    const featureProtected = getFeatureProtected(feature, modelNameValue)
    renderClusteredBar(elementsProvider.CLUSTERED_BAR, modelNameValue, featureProtected)
    
}


const renderClusteredBar = (selector,modelNameValue, featureProtected) => {
    
    var models_ = getmodel()
    var models = transformToSet(models_)

    var margin = {'top': 5, 'right': 10, 'bottom': 20, 'left': 10}
    var width = getWidth() + margin.left + margin.right
    var height = getHeight() + margin.bottom + margin.top
    var barPadding = .2
    var axisTicks = {qty: 5, outerSize: 0, dateFormat: '%m-%d'}
    
   
    var modelsOverlapping= renderClusteredBarChart(selector,models_)
    models = transformToSet(modelsOverlapping)
    const ribbonPathFast = viewState.get('path')
    const iteratorFast = ribbonPathFast.values()
    const setFeaturesFast = iteratorFast.next().value
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
          
    var xAxis = d3.axisBottom(xScale0).tickSizeOuter(axisTicks.outerSize);
    var yAxis = d3.axisLeft(yScale).ticks(axisTicks.qty).tickSizeOuter(axisTicks.outerSize);
          
    xScale0.domain(models.map(d => d.section));
    xScale1.domain(['model1', 'model2', 'model3','model4', 'model5', 'model6']).range([0, xScale0.bandwidth()]);
    yScale.domain([0, maxValue(modelsOverlapping)])

  var section = svg.selectAll(".section")
   .data(models)
   .enter().append("g")
   .attr("class", "section")
   .attr("transform", d => `translate(${xScale0(d.section)},0)`);


  

/* Add model1 bars: Agglomerative-Clustering */
  section.selectAll(".bar.model1")
  .data(d => [d])
  .enter()
  .append("rect")
  .attr("class", "bar model1")
  .style("fill",function() {return modelNameValue == 'Agglomerative-Clustering' ? "#26a69a" : "#98abc5";})
  .style('opacity',function() {return modelNameValue == 'Agglomerative-Clustering' ? .9 : .4;})
  .attr("x", d => xScale1('model1'))
  .attr("y", d => yScale(d.model1))
  .text(d => d.model1)
  .attr("width", xScale1.bandwidth())
  .attr("height", d => {
    return height - margin.top - margin.bottom - yScale(d.model1)
  })
  .on("mouseover",(d) =>{
    var elements = document.querySelectorAll(':hover');
    var l = elements.length
        l = l-1
    var activeBar = window.activeBar = elements[l];

    tooldiv.style('visibility','visible')
            .style('background-color', function() {return modelNameValue == 'Agglomerative-Clustering' ? "#26a69a" : "#fff";})
            .html(function() {return modelNameValue == 'Agglomerative-Clustering' ? "<b>"+ " Model: " + "</b>" + 'Agglomerative-Clustering' + "<br>" + "<b>"+ "Classification: " + "</b>" +  
            d.section + "<br>" + "<b>"+ "Quantity: " + "<b>"+ d.model1 + "<br>"+ "<b>"+ "Causal Discovery: " + "<b>"+ causalDiscovery(featureProtected): "<b>"+ " Model: " + "</b>" + 'Agglomerative-Clustering' + "<br>" + "<b>"+ "Classification: " + "</b>" +  
            d.section + "<br>" + "<b>"+ "Quantity: " + "<b>"+ d.model1;})
    d3.select(activeBar).attr("stroke","black").attr("stroke-width",1.8)
  })
  .on("mousemove",(d) =>{
    tooldiv.style('top', (d3.event.pageY - height/2) + 'px')
            .style('left', (d3.event.pageX-width/4) + 'px')
             
  })
  .on("mouseout",(d) =>{
    tooldiv.style('visibility','hidden')
    d3.select(window.activeBar).attr("stroke","white").attr("stroke-width",0.0) 
    window.activeBar = {};
  })



section.selectAll(null)
  .data(d => [d])
  .enter().append("text")
  .attr("class", "bar model1")
  .attr("x", d => xScale1('model1') + 4)
  .attr("y", d => yScale(d.model1) + 9)
  .style('font-size', '9px')
  .attr("fill", function() {return modelNameValue == 'Agglomerative-Clustering' ? "#fff" : "#000";})
  .style("font-weight", function() {return modelNameValue == 'Agglomerative-Clustering' ? "bold" : 100;})
  .text(d => d.model1)
  

/* Add model1_ bars */
section.selectAll(".bar.model1_")
  .data(d => [d])
  .enter()
  .append("rect")
  .attr("class", "bar model1_")
  .style("fill","#000000")
  .style('opacity',.7)
  .attr("x", d => xScale1('model1'))
  .attr("y", d => yScale(d.model1_))
  .attr("width", xScale1.bandwidth())
  .attr("height", d => {
    return height - margin.top - margin.bottom - yScale(d.model1_)
  })
  .on("mouseover",(d) =>{
    tooldiv.style('visibility','visible')
            .style('background-color', "#000")
            .html("<span style=color:#ffffff>" + "<b>"+ " Model: " + "</b>" + 'Agglomerative-Clustering' + "<br>" + "<b>"+ "Classification: " + "</b>" +  
            d.section + "<br>" + "<b>"+ "Quantity: " + "<b>"+ d.model1_ + "<br>" + "<b>"+ " Path: " 
            + "</b>" +  setFeaturesFast[0].join(" → ") + "</span>")
    section.select(".bar.model1_").attr("stroke","white").attr("stroke-width",1.8)
    
  })
  .on("mousemove",(d) =>{
    tooldiv.style('top', (d3.event.pageY - height/2) + 'px')
            .style('left', (d3.event.pageX-width/4) + 'px')
             
  })
  .on("mouseout",(d) =>{
    tooldiv.style('visibility','hidden')
    section.select(".bar.model1_").attr("stroke","black").attr("stroke-width",0.0) 
  })
  

section.selectAll(null)
  .data(d => [d])
  .enter().append("text")
  .attr("class", "bar model1_")
  .attr("x", d => xScale1('model1') + 4)
  .attr("y", d => yScale(d.model1_) + 9)
  .style('font-size', '9px')
  .attr("fill", "#fff")
  .style("font-weight", function() {return modelNameValue == 'Agglomerative-Clustering' ? "bold" : 100;})
  .text(d => d.model1_)




   
/* Add model2 bars: Decision-Tree */
section.selectAll(".bar.model2")
  .data(d => [d])
  .enter()
  .append("rect")
  .attr("class", "bar model2")
  .style("fill",function() {return modelNameValue == 'Decision-Tree' ? "#26a69a" : "#8a89a6";})
  .style('opacity',function() {return modelNameValue == 'Decision-Tree' ? .9 : .4;})
  .attr("x", d => xScale1('model2'))
  .attr("y", d => yScale(d.model2))
  .attr("width", xScale1.bandwidth())
  .attr("height", d => {
    return height - margin.top - margin.bottom - yScale(d.model2)
  })
  .on("mouseover",(d) =>{
    var elements = document.querySelectorAll(':hover');
    var l = elements.length
        l = l-1
    var activeBar = window.activeBar = elements[l];
    tooldiv.style('visibility','visible')
            .style('background-color', function() {return modelNameValue == 'Decision-Tree' ? "#26a69a" : "#fff";})
            .html(function() {return modelNameValue == 'Decision-Tree' ?"<b>"+ " Model: " + "</b>" + 'Decision-Tree' + "<br>" + 
            "<b>"+ "Classification: " + "</b>" +  d.section + "<br>" + "<b>"+ "Quantity: " + "<b>"+ d.model2 + "<br>"+ "<b>"+ 
            "Causal Discovery: " + "<b>"+ causalDiscovery(featureProtected): "<b>"+ " Model: " + "</b>" + 'Decision-Tree' + "<br>" + 
            "<b>"+ "Classification: " + "</b>" +  d.section + "<br>" + "<b>"+ "Quantity: " + "<b>"+ d.model2;})
    d3.select(activeBar).attr("stroke","black").attr("stroke-width",1.8)  
  })
  .on("mousemove",() =>{
    tooldiv.style('top', (d3.event.pageY - height/2) + 'px' )
            .style('left', (d3.event.pageX-width/4) + 'px' )
    
  })
  .on("mouseout",() =>{
    tooldiv.style('visibility','hidden')
    d3.select(window.activeBar).attr("stroke","white").attr("stroke-width",0.0) 
    window.activeBar = {};
  })

  section.selectAll(null)
  .data(d => [d])
  .enter().append("text")
  .attr("class", "bar model2")
  .attr("x", d => xScale1('model2') + 4)
  .attr("y", d => yScale(d.model2) + 9)
  .style('font-size', '9px')
  .attr("fill", function() {return modelNameValue == 'Decision-Tree' ? "#fff" : "#000";})
  .style("font-weight", function() {return modelNameValue == 'Decision-Tree' ? "bold" : 100;})
  .text(d => d.model2)

/* Add model2_ bars */

section.selectAll(".bar.model2_")
  .data(d => [d])
  .enter()
  .append("rect")
  .attr("class", "bar model2_")
  .style("fill","#000000")
  .style('opacity',.7)
  .attr("x", d => xScale1('model2'))
  .attr("y", d => yScale(d.model2_))
  .attr("width", xScale1.bandwidth())
  .attr("height", d => {
    return height - margin.top - margin.bottom - yScale(d.model2_)
  })
  .on("mouseover",(d) =>{
    tooldiv.style('visibility','visible')
            .style('background-color', "#000")
            .html("<span style=color:#ffffff>" + "<b>"+ " Model: " + "</b>" + 'Decision-Tree' + "<br>" + "<b>"+ "Classification: " + "</b>" +  
            d.section + "<br>" + "<b>"+ "Quantity: " + "<b>"+ d.model2_ + "<br>" + "<b>"+ " Path: " 
            + "</b>" +  setFeaturesFast[0].join(" → ") + "</span>")
    section.select(".bar.model2_").attr("stroke","white").attr("stroke-width",1.8)
    
  })
  .on("mousemove",(d) =>{
    tooldiv.style('top', (d3.event.pageY - height/2) + 'px')
            .style('left', (d3.event.pageX-width/4) + 'px')
             
  })
  .on("mouseout",(d) =>{
    tooldiv.style('visibility','hidden')
    section.select(".bar.model2_").attr("stroke","black").attr("stroke-width",0.0) 
  })

section.selectAll(null)
  .data(d => [d])
  .enter().append("text")
  .attr("class", "bar model2_")
  .attr("x", d => xScale1('model2') + 4)
  .attr("y", d => yScale(d.model2_) + 9)
  .style('font-size', '9px')
  .attr("fill", "#fff")
  .style("font-weight", function() {return modelNameValue == 'Decision-Tree' ? "bold" : 100;})
  .text(d => d.model2_)

/* Add model3 bars: Gaussian-Naive-Bayes */  
section.selectAll(".bar.model3")
  .data(d => [d])
  .enter()
  .append("rect")
  .attr("class", "bar model3")
  .style("fill",function() {return modelNameValue == 'Gaussian-Naive-Bayes' ? "#26a69a" : "#7b6888";})
  .style('opacity',function() {return modelNameValue == 'Gaussian-Naive-Bayes' ? .9 : .4;})
  .attr("x", d => xScale1('model3'))
  .attr("y", d => yScale(d.model3))
  .attr("width", xScale1.bandwidth())
  .attr("height", d => {
    return height - margin.top - margin.bottom - yScale(d.model3)
  })
  .on("mouseover",(d) =>{
    var elements = document.querySelectorAll(':hover');
    var l = elements.length
        l = l-1
    var activeBar = window.activeBar = elements[l];
    tooldiv.style('visibility','visible')
            .style('background-color', function() {return modelNameValue == 'Gaussian-Naive-Bayes' ? "#26a69a" : "#fff";})
            .html(function() {return modelNameValue == 'Gaussian-Naive-Bayes' ? "<b>"+ " Model: " + "</b>" + 'Gaussian-Naive-Bayes' + "<br>" + "<b>"+ "Classification: " + "</b>" +  
            d.section + "<br>" + "<b>"+ "Quantity: " + "<b>"+ d.model3 + "<br>"+ "<b>"+ 
            "Causal Discovery: " + "<b>"+ causalDiscovery(featureProtected) :"<b>"+ " Model: " + "</b>" + 'Gaussian-Naive-Bayes' + "<br>" + "<b>"+ "Classification: " + "</b>" +  
            d.section + "<br>" + "<b>"+ "Quantity: " + "<b>"+ d.model3})
           d3.select(activeBar).attr("stroke","black").attr("stroke-width",1.8) 
  })
  .on("mousemove",() =>{
    tooldiv.style('top', (d3.event.pageY - height/2) + 'px' )
            .style('left', (d3.event.pageX-width/4) + 'px' )
    
  })
  .on("mouseout",() =>{
    tooldiv.style('visibility','hidden')
    d3.select(window.activeBar).attr("stroke","white").attr("stroke-width",0.0) 
    window.activeBar = {};
  })

  section.selectAll(null)
  .data(d => [d])
  .enter().append("text")
  .attr("class", "bar model3")
  .attr("x", d => xScale1('model3') + 4)
  .attr("y", d => yScale(d.model3) + 9)
  .style('font-size', '9px')
  .attr("fill", function() {return modelNameValue == 'Gaussian-Naive-Bayes' ? "#fff" : "#000";})
  .style("font-weight", function() {return modelNameValue == 'Gaussian-Naive-Bayes' ? "bold" : 100;})
  .text(d => d.model3)

  /* Add model3_ bars */

  section.selectAll(".bar.model3_")
  .data(d => [d])
  .enter()
  .append("rect")
  .attr("class", "bar model3_")
  .style("fill","#000000")
  .style('opacity',.7)
  .attr("x", d => xScale1('model3'))
  .attr("y", d => yScale(d.model3_))
  .attr("width", xScale1.bandwidth())
  .attr("height", d => {
    return height - margin.top - margin.bottom - yScale(d.model3_)
  })
  .on("mouseover",(d) =>{
    tooldiv.style('visibility','visible')
            .style('background-color', "#000")
            .html("<span style=color:#ffffff>" + "<b>"+ " Model: " + "</b>" + 'Gaussian-Naive-Bayes' + "<br>" + "<b>"+ "Classification: " + "</b>" +  
            d.section + "<br>" + "<b>"+ "Quantity: " + "<b>"+ d.model3_ + "<br>" + "<b>"+ " Path: " 
            + "</b>" +  setFeaturesFast[0].join(" → ") + "</span>")
    section.select(".bar.model3_").attr("stroke","white").attr("stroke-width",1.8)
    
  })
  .on("mousemove",(d) =>{
    tooldiv.style('top', (d3.event.pageY - height/2) + 'px')
            .style('left', (d3.event.pageX-width/4) + 'px')
             
  })
  .on("mouseout",(d) =>{
    tooldiv.style('visibility','hidden')
    section.select(".bar.model3_").attr("stroke","black").attr("stroke-width",0.0) 
  })


  section.selectAll(null)
  .data(d => [d])
  .enter().append("text")
  .attr("class", "bar model3_")
  .attr("x", d => xScale1('model3') + 4)
  .attr("y", d => yScale(d.model3_) + 9)
  .style('font-size', '9px')
  .attr("fill", "#fff")
  .style("font-weight", function() {return modelNameValue == 'Gaussian-Naive-Bayes' ? "bold" : 100;})
  .text(d => d.model3_)

  /* Add model4 bars: Kmeans */
  section.selectAll(".bar.model4")
  .data(d => [d])
  .enter()
  .append("rect")
  .attr("class", "bar model4")
  .style("fill",function() {return modelNameValue == 'Kmeans' ? "#26a69a" : "#6b486b";})
  .style('opacity',function() {return modelNameValue == 'Kmeans' ? .9 : .4;})
  .attr("x", d => xScale1('model4'))
  .attr("y", d => yScale(d.model4))
  .attr("width", xScale1.bandwidth())
  .attr("height", d => {
    return height - margin.top - margin.bottom - yScale(d.model4)
  })
  .on("mouseover",(d) =>{
    var elements = document.querySelectorAll(':hover');
    var l = elements.length
        l = l-1
    var activeBar = window.activeBar = elements[l];
    tooldiv.style('visibility','visible')
            .style('background-color', function() {return modelNameValue == 'Kmeans' ? "#26a69a" : "#fff";})
            .html(function() {return modelNameValue == 'Kmeans'? "<b>"+ " Model: " + "</b>" + 'Kmeans' + "<br>" + "<b>"+ "Classification: " + "</b>" +  d.section + 
            "<br>" + "<b>"+ "Quantity: " + "<b>"+ d.model4 + "<br>"+ "<b>"+ 
            "Causal Discovery: " + "<b>"+ causalDiscovery(featureProtected) :"<b>"+ " Model: " + "</b>" + 'Kmeans' + "<br>" + "<b>"+ "Classification: " + "</b>" +  d.section + 
            "<br>" + "<b>"+ "Quantity: " + "<b>"+ d.model4})
           
            d3.select(activeBar).attr("stroke","black").attr("stroke-width",1.8) 
  })
  .on("mousemove",() =>{
    tooldiv.style('top', (d3.event.pageY - height/2) + 'px' )
            .style('left', (d3.event.pageX-width/4) + 'px' )
    
  })
  .on("mouseout",() =>{
    tooldiv.style('visibility','hidden')
    d3.select(window.activeBar).attr("stroke","white").attr("stroke-width",0.0) 
    window.activeBar = {};
  })

  section.selectAll(null)
  .data(d => [d])
  .enter().append("text")
  .attr("class", "bar model4")
  .attr("x", d => xScale1('model4') + 4)
  .attr("y", d => yScale(d.model4) + 9)
  .style('font-size', '9px')
  .attr("fill", function() {return modelNameValue == 'Kmeans' ? "#fff" : "#000";})
  .style("font-weight", function() {return modelNameValue == 'Kmeans' ? "bold" : 100;})
  .text(d => d.model4)
 
   /* Add model4_ bars */
  
  
  section.selectAll(".bar.model4_")
  .data(d => [d])
  .enter()
  .append("rect")
  .attr("class", "bar model4_")
  .style("fill","#000000")
  .style('opacity',.7)
  .attr("x", d => xScale1('model4'))
  .attr("y", d => yScale(d.model4_))
  .attr("width", xScale1.bandwidth())
  .attr("height", d => {
    return height - margin.top - margin.bottom - yScale(d.model4_)
  })
  .on("mouseover",(d) =>{
    tooldiv.style('visibility','visible')
            .style('background-color', "#000")
            .html("<span style=color:#ffffff>" + "<b>"+ " Model: " + "</b>" + 'Kmeans' + "<br>" + "<b>"+ "Classification: " + "</b>" +  
            d.section + "<br>" + "<b>"+ "Quantity: " + "<b>"+ d.model4_ + "<br>" + "<b>"+ " Path: " 
            + "</b>" +  setFeaturesFast[0].join(" → ") + "</span>")
    section.select(".bar.model4_").attr("stroke","white").attr("stroke-width",1.8)
    
  })
  .on("mousemove",(d) =>{
    tooldiv.style('top', (d3.event.pageY - height/2) + 'px')
            .style('left', (d3.event.pageX-width/4) + 'px')
             
  })
  .on("mouseout",(d) =>{
    tooldiv.style('visibility','hidden')
    section.select(".bar.model4_").attr("stroke","black").attr("stroke-width",0.0) 
  })

  section.selectAll(null)
  .data(d => [d])
  .enter().append("text")
  .attr("class", "bar model4_")
  .attr("x", d => xScale1('model4') + 4)
  .attr("y", d => yScale(d.model4_) + 9)
  .style('font-size', '9px')
  .attr("fill", "#fff")
  .style("font-weight", function() {return modelNameValue == 'Kmeans' ? "bold" : 100;})
  .text(d => d.model4_)

  /* Add model5 bars: KNN */

  section.selectAll(".bar.model5")
  .data(d => [d])
  .enter()
  .append("rect")
  .attr("class", "bar model5")
  .style("fill",function() {return modelNameValue == 'KNN' ? "#26a69a" : "#a05d56";})
  .style('opacity',function() {return modelNameValue == 'KNN' ? .9 : .4;})
  .attr("x", d => xScale1('model5'))
  .attr("y", d => yScale(d.model5))
  .attr("width", xScale1.bandwidth())
  .attr("height", d => {
    return height - margin.top - margin.bottom - yScale(d.model5)
  })
  .on("mouseover",(d) =>{
    var elements = document.querySelectorAll(':hover');
    var l = elements.length
        l = l-1
    var activeBar = window.activeBar = elements[l];
    tooldiv.style('visibility','visible')
            .style('background-color', function() {return modelNameValue == 'KNN' ? "#26a69a" : "#fff";})
            .html(function() {return modelNameValue == 'KNN'? "<b>"+ " Model: " + "</b>" + 'KNN' + "<br>" + "<b>"+ 
            "Classification: " + "</b>" +  d.section + "<br>" + "<b>"+ "Quantity: " + "<b>"+ d.model5 + "<br>"+ "<b>"+ 
            "Causal Discovery: " + "<b>"+ causalDiscovery(featureProtected) :"<b>"+ " Model: " + "</b>" + 'KNN' + "<br>" + "<b>"+ 
            "Classification: " + "</b>" +  d.section + "<br>" + "<b>"+ "Quantity: " + "<b>"+ d.model5})
    d3.select(activeBar).attr("stroke","black").attr("stroke-width",1.8)  
  })
  .on("mousemove",() =>{
    tooldiv.style('top', (d3.event.pageY - height/2) + 'px' )
            .style('left', (d3.event.pageX-width/4) + 'px' )
    
  })
  .on("mouseout",() =>{
    tooldiv.style('visibility','hidden')
    d3.select(window.activeBar).attr("stroke","white").attr("stroke-width",0.0) 
    window.activeBar = {}; 
  })

  section.selectAll(null)
  .data(d => [d])
  .enter().append("text")
  .attr("class", "bar model5")
  .attr("x", d => xScale1('model5') + 4)
  .attr("y", d => yScale(d.model5) + 9)
  .style('font-size', '9px')
  .attr("fill", function() {return modelNameValue == 'KNN' ? "#fff" : "#000";})
  .style("font-weight", function() {return modelNameValue == 'KNN' ? "bold" : 100;})
  .text(d => d.model5)

  /* Add model5_ bars */

  section.selectAll(".bar.model5_")
  .data(d => [d])
  .enter()
  .append("rect")
  .attr("class", "bar model5_")
  .style("fill","#000000")
  .style('opacity',.7)
  .attr("x", d => xScale1('model5'))
  .attr("y", d => yScale(d.model5_))
  .attr("width", xScale1.bandwidth())
  .attr("height", d => {
    return height - margin.top - margin.bottom - yScale(d.model5_)
  })
  .on("mouseover",(d) =>{
    tooldiv.style('visibility','visible')
            .style('background-color', "#000")
            .html("<span style=color:#ffffff>" + "<b>"+ " Model: " + "</b>" + 'KNN' + "<br>" + "<b>"+ "Classification: " + "</b>" +  
            d.section + "<br>" + "<b>"+ "Quantity: " + "<b>"+ d.model5_ + "<br>" + "<b>"+ " Path: " 
            + "</b>" +  setFeaturesFast[0].join(" → ") + "</span>")
    section.select(".bar.model5_").attr("stroke","white").attr("stroke-width",1.8)
    
  })
  .on("mousemove",(d) =>{
    tooldiv.style('top', (d3.event.pageY - height/2) + 'px')
            .style('left', (d3.event.pageX-width/4) + 'px')
             
  })
  .on("mouseout",(d) =>{
    tooldiv.style('visibility','hidden')
    section.select(".bar.model5_").attr("stroke","black").attr("stroke-width",0.0) 
  })


  section.selectAll(null)
  .data(d => [d])
  .enter().append("text")
  .attr("class", "bar model5_")
  .attr("x", d => xScale1('model5') + 4)
  .attr("y", d => yScale(d.model5_) + 9)
  .style('font-size', '9px')
  .attr("fill", "#fff")
  .style("font-weight", function() {return modelNameValue == 'KNN' ? "bold" : 100;})
  .text(d => d.model5_)


  /* Add model6 bars: SVM */
  section.selectAll(".bar.model6")
  .data(d => [d])
  .enter()
  .append("rect")
  .attr("class", "bar model6")
  .style("fill",function() {return modelNameValue == 'SVM' ? "#26a69a" : "#d0743c";})
  .style('opacity',function() {return modelNameValue == 'SVM' ? .9 : .4;})
  .attr("x", d => xScale1('model6'))
  .attr("y", d => yScale(d.model6))
  .attr("width", xScale1.bandwidth())
  .attr("height", d => {
    return height - margin.top - margin.bottom - yScale(d.model6)
  })
  .on("mouseover",(d) =>{
    var elements = document.querySelectorAll(':hover');
    var l = elements.length
        l = l-1
    var activeBar = window.activeBar = elements[l];
    tooldiv.style('visibility','visible')
            .style('background-color', function() {return modelNameValue == 'SVM' ? "#26a69a" : "#fff";})
            .html(function() {return modelNameValue == 'SVM'? "<b>"+ " Model: " + "</b>" + 'SVM' + "<br>" + "<b>"+ "Classification: " + "</b>" +  d.section + 
            "<br>" + "<b>"+ "Quantity: " + "<b>"+ d.model6 + "<br>"+ "<b>"+ 
            "Causal Discovery: " + "<b>"+ causalDiscovery(featureProtected) :"<b>"+ " Model: " + "</b>" + 'SVM' + "<br>" + "<b>"+ "Classification: " + "</b>" +  d.section + 
            "<br>" + "<b>"+ "Quantity: " + "<b>"+ d.model6})
            d3.select(activeBar).attr("stroke","black").attr("stroke-width",1.8)  
  })
  .on("mousemove",() =>{
    tooldiv.style('top', (d3.event.pageY - height/2) + 'px' )
            .style('left', (d3.event.pageX-width/4) + 'px' )
    
  })
  .on("mouseout",() =>{
    tooldiv.style('visibility','hidden')
    d3.select(window.activeBar).attr("stroke","white").attr("stroke-width",0.0) 
    window.activeBar = {}; 
  })

  section.selectAll(null)
  .data(d => [d])
  .enter().append("text")
  .attr("class", "bar model6")
  .attr("x", d => xScale1('model6') + 4)
  .attr("y", d => yScale(d.model6) + 9)
  .style('font-size', '9px')
  .attr("fill", function() {return modelNameValue == 'SVM' ? "#fff" : "#000";})
  .style("font-weight", function() {return modelNameValue == 'SVM' ? "bold" : 100;})
  .text(d => d.model6)

  /* Add model6_ bars */

  section.selectAll(".bar.model6_")
  .data(d => [d])
  .enter()
  .append("rect")
  .attr("class", "bar model6_")
  .style("fill","#000000")
  .style('opacity',.7)
  .attr("x", d => xScale1('model6'))
  .attr("y", d => yScale(d.model6_))
  .attr("width", xScale1.bandwidth())
  .attr("height", d => {
    return height - margin.top - margin.bottom - yScale(d.model6_)
  })
  .on("mouseover",(d) =>{
    tooldiv.style('visibility','visible')
            .style('background-color', "#000")
            .html("<span style=color:#ffffff>" + "<b>"+ " Model: " + "</b>" + 'SVM' + "<br>" + "<b>"+ "Classification: " + "</b>" +  
            d.section + "<br>" + "<b>"+ "Quantity: " + "<b>"+ d.model6_ + "<br>" + "<b>"+ " Path: " 
            + "</b>" +  setFeaturesFast[0].join(" → ") + "</span>")
    section.select(".bar.model6_").attr("stroke","white").attr("stroke-width",1.8)
    
  })
  .on("mousemove",(d) =>{
    tooldiv.style('top', (d3.event.pageY - height/2) + 'px')
            .style('left', (d3.event.pageX-width/4) + 'px')
             
  })
  .on("mouseout",(d) =>{
    tooldiv.style('visibility','hidden')
    section.select(".bar.model6_").attr("stroke","black").attr("stroke-width",0.0) 
  })

  section.selectAll(null)
  .data(d => [d])
  .enter().append("text")
  .attr("class", "bar model6_")
  .attr("x", d => xScale1('model6') + 4)
  .attr("y", d => yScale(d.model6_) + 9)
  .style('font-size', '9px')
  .attr("fill", "#fff")
  .style("font-weight", function() {return modelNameValue == 'SVM' ? "bold" : 100;})
  .text(d => d.model6_)

// Add the X Axis
svg.append("g")
   .attr("class", "axis x_axis")
   .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
   .call(xAxis)

information(models, modelNameValue)


}

const information = (models, modelNameValue) => {
  const precision = d3.select(elementsProvider.PRECISION)
  
  if(modelNameValue=='Agglomerative-Clustering'){
    //precision.text("Precision: " + models[0].model1/ (models[0].model1 + models[1].model1) 
                    //+ ", Accuracy: " + (models[0].model1 + models[3].model1)/ (models[0].model1 + models[3].model1 + models[1].model1 + models[2].model1)
                    //+ ", Specificity: " + models[3].model1/(models[3].model1 + models[1].model1)
                    //+ ", Sensitivity: " + models[0].model1/(models[0].model1 + models[2].model1))
    precision.html("<span style=color:#26a69a>" +"<b>" + "Precision: " + "</b>" + models[0].model1/ (models[0].model1 + models[1].model1) 
    + "<b>"  + ", Accuracy: " + "</b>" + (models[0].model1 + models[3].model1)/ (models[0].model1 + models[3].model1 + models[1].model1 + models[2].model1)
    + "<b>"  + ", Specificity: " + "</b>" + models[3].model1/(models[3].model1 + models[1].model1)
    + "<b>"  + ", Sensitivity: " + "</b>" + models[0].model1/(models[0].model1 + models[2].model1) + "</span>")
  }
  else{
    if(modelNameValue=='Decision-Tree'){
      precision.text("Precision: " + models[0].model2/ (models[0].model2 + models[1].model2) 
                    + ", Accuracy: " + (models[0].model2 + models[3].model2)/ (models[0].model2 + models[3].model2 + 
                                        models[1].model2 + models[2].model2)
                    + ", Specificity: " + models[3].model2/(models[3].model2 + models[1].model2)
                    + ", Sensitivity: " + models[0].model2/(models[0].model2 + models[2].model2))

    }
    else{
      if(modelNameValue=='Gaussian-Naive-Bayes'){
        precision.text("Precision: " + models[0].model3/ (models[0].model3 + models[1].model3) 
        + ", Accuracy: " + (models[0].model3 + models[3].model3)/ (models[0].model3 + models[3].model3 + 
                            models[1].model3 + models[2].model3)
        + ", Specificity: " + models[3].model3/(models[3].model3 + models[1].model3)
        + ", Sensitivity: " + models[0].model3/(models[0].model3 + models[2].model3))
      }
      else{
        if(modelNameValue=='Kmeans'){
          precision.text("Precision: " + models[0].model4/ (models[0].model4 + models[1].model4) 
          + ", Accuracy: " + (models[0].model4 + models[3].model4)/ (models[0].model4 + models[3].model4 + 
                              models[1].model4 + models[2].model4)
          + ", Specificity: " + models[3].model4/(models[3].model4 + models[1].model4)
          + ", Sensitivity: " + models[0].model4/(models[0].model4 + models[2].model4))
        }
        else{
          if(modelNameValue=='KNN'){
            precision.text("Precision: " + models[0].model5/ (models[0].model5 + models[1].model5) 
            + ", Accuracy: " + (models[0].model5 + models[3].model5)/ (models[0].model5 + models[3].model5 + 
                                models[1].model5 + models[2].model5)
            + ", Specificity: " + models[3].model5/(models[3].model5 + models[1].model5)
            + ", Sensitivity: " + models[0].model5/(models[0].model5 + models[2].model5))
          }
          else{
            precision.text("Precision: " + models[0].model6/ (models[0].model6 + models[1].model6) 
            + ", Accuracy: " + (models[0].model6 + models[3].model6)/ (models[0].model6 + models[3].model6 + 
                                models[1].model6 + models[2].model6)
            + ", Specificity: " + models[3].model6/(models[3].model6 + models[1].model6)
            + ", Sensitivity: " + models[0].model6/(models[0].model6 + models[2].model6))
          }
        }
      }
    }
  }
}

const causalDiscovery = (list) => {
  const causal = []
  for (var i = 1; i < list[0].length; i++){
     causal.push(list[0][i])
  }
  
  return causal.join(" → ")
}

const getmodel = () => {

  var model = [{
    "section":"True Positive",
    "model1":0,
    "model2":0,
    "model3":0,
    "model4":0,
    "model5":0,
    "model6":0,
    "model1_":0,
    "model2_":0,
    "model3_":0,
    "model4_":0,
    "model5_":0,
    "model6_":0,
    
  },
  {
    "section":"False Positive",
    "model1":0,
    "model2":0,
    "model3":0,
    "model4":0,
    "model5":0,
    "model6":0,
    "model1_":0,
    "model2_":0,
    "model3_":0,
    "model4_":0,
    "model5_":0,
    "model6_":0,
  },
  {
    "section":"False Negative",
    "model1":0,
    "model2":0,
    "model3":0,
    "model4":0,
    "model5":0,
    "model6":0,
    "model1_":0,
    "model2_":0,
    "model3_":0,
    "model4_":0,
    "model5_":0,
    "model6_":0,
  },
  {
    "section":"True Negative",
    "model1":0,
    "model2":0,
    "model3":0,
    "model4":0,
    "model5":0,
    "model6":0,
    "model1_":0,
    "model2_":0,
    "model3_":0,
    "model4_":0,
    "model5_":0,
    "model6_":0,
  }]
  const dataset = viewState.get('dataset')
  for (var i = 0; i < dataset.size; i++){
    if(dataset.get(i).NameClassification == "TP"){
      if(dataset.get(i).Models == 'Agglomerative-Clustering')
         model[0].model1+=1
      else{
        if(dataset.get(i).Models == 'Decision-Tree') 
           model[0].model2+=1
        else{
          if(dataset.get(i).Models == 'Gaussian-Naive-Bayes') 
             model[0].model3+=1
          else{
            if(dataset.get(i).Models == 'Kmeans')
                model[0].model4+=1
            else{
              if(dataset.get(i).Models == 'KNN')
                  model[0].model5+=1
              else
                  model[0].model6+=1
            }
          }
        }
      }
    }
    else{
      if(dataset.get(i).NameClassification == "FP"){
        if(dataset.get(i).Models == 'Agglomerative-Clustering')
            model[1].model1+=1
        else{
          if(dataset.get(i).Models == 'Decision-Tree') 
              model[1].model2+=1
          else{
            if(dataset.get(i).Models == 'Gaussian-Naive-Bayes') 
              model[1].model3+=1
            else{
              if(dataset.get(i).Models == 'Kmeans')
                model[1].model4+=1
              else{
                if(dataset.get(i).Models == 'KNN')
                  model[1].model5+=1
                else
                  model[1].model6+=1
              }
            }
          }
        }
      }
      else{
        if(dataset.get(i).NameClassification == "FN"){
          if(dataset.get(i).Models == 'Agglomerative-Clustering')
            model[2].model1+=1
          else{
            if(dataset.get(i).Models == 'Decision-Tree') 
              model[2].model2+=1
            else{
              if(dataset.get(i).Models == 'Gaussian-Naive-Bayes') 
                model[2].model3+=1
              else{
                if(dataset.get(i).Models == 'Kmeans')
                  model[2].model4+=1
                else{
                  if(dataset.get(i).Models == 'KNN')
                    model[2].model5+=1
                  else
                    model[2].model6+=1
                }
              }
            }
          }
        }
        else{
          if(dataset.get(i).Models == 'Agglomerative-Clustering')
            model[3].model1+=1
          else{
            if(dataset.get(i).Models == 'Decision-Tree') 
              model[3].model2+=1
            else{
              if(dataset.get(i).Models == 'Gaussian-Naive-Bayes') 
                model[3].model3+=1
              else{
                if(dataset.get(i).Models == 'Kmeans')
                  model[3].model4+=1
                else{
                  if(dataset.get(i).Models == 'KNN')
                    model[3].model5+=1
                  else
                    model[3].model6+=1
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
    const width = (d3.select(elementsProvider.CONTAINER).node().getBoundingClientRect().width *75)/100
    return width
} 

const getHeight = () => {
  const height = (d3.select(elementsProvider.CONTAINER).node().getBoundingClientRect().height *85)/100 - 56 - (d3.select(elementsProvider.CONTAINER).node().getBoundingClientRect().height *10)/100 - 24
  return height
} 
  
const transformToSet = (otherType) => {
    otherType.map(i => {
          i.section = i.section
          return i
    })
    return otherType
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

const overlappingBars = (modelName,setFeatures,model) =>{
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
   
const renderClusteredBarChart = (selector,models) =>{
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



const getFeatureProtected = (featuresEspecial, modelName) => {
 
  var data1 = ['NameClassification', 'age', 'workclass', 'education', 'marital-status', 'race', 'sex', 'hours-per-week', 'country', 'Models']
  
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







  















  











