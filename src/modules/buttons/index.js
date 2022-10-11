import { elementsProvider } from '../../utils/domUtils.js'
import storeUtils from '../redux/storeUtils.js'
import Immutable from 'immutable'
import actions from '../parallelSets/actions_.js'
import * as d3 from 'd3'


let viewState = Immutable.Map({})

export default () => {
  const innerRender = () => {
    const connectStates = ['dataset','path']

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
  const way = renderPath()
  if(way!=undefined){
    renderButton(elementsProvider.BUTTON1)
    renderButtonGeneralView(elementsProvider.BUTTON2)
    renderButtonSpecificView(elementsProvider.BUTTON3)
  } 
  
}

const renderButton = (selector) => {
  const button1 = d3.select(selector)
                    
  button1.append('button')
         .attr('type','button')
         .style("background", '#2196F3')
         .style("border-color", '#2196F3')
         .style("border", '2px solid #2196F3')
         .style("color", 'white')
         .style("border-radius", '3px')
         .style("padding", '2px 15px')
         .text('Clear path')
         .on("click", () => {
            return togglePath()
         })
}

const renderButtonGeneralView = (selector) => {
    const button2 = d3.select(selector)
                      
    button2.append('button')
           .attr('type','button')
           .style("background", '#9467bd')
           .style("border-color", '#9467bd')
           .style("border", '2px solid #9467bd')
           .style("color", 'white')
           //.style('font-size', '11px')
           .style("border-radius", '3px')
           .style("padding", '2px 10px')
           .text('General view')
           .on("click", () => {
              return bindFaqButton1(selector)
           })
  }

const renderButtonSpecificView = (selector) => {
    const button3 = d3.select(selector)
                      
    button3.append('button')
           .attr('type','button')
           .style("background", '#17becf')
           .style("border-color", '#17becf')
           .style("border", '2px solid #17becf')
           .style("color", 'white')
           //.style('font-size', '11px')
           .style("border-radius", '3px')
           .style("padding", '2px 10px')
           .text('Specific view')
           .on("click", () => {
            return bindFaqButton2()
           })
  }


const renderPath = () =>{
    var button1 = d3.select(elementsProvider.BUTTON1)
        button1.select('button').remove()
    
    var button2 = d3.select(elementsProvider.BUTTON2)
        button2.select('button').remove()
    
    var button3 = d3.select(elementsProvider.BUTTON3)
        button3.select('button').remove()
    const path = viewState.get('path')
    const iterator = path.values()
    return iterator.next().value
  }


  const togglePath = () => {
    const path = []
    storeUtils.dispatch(actions.togglePath(undefined))
  }
     
  const bindFaqButton1 = () => {
    $('#modal1').modal('open')
  }
  
  const bindFaqButton2 = () => {
    $('#modal2').modal('open')
  }