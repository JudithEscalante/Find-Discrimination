import { elementsProvider } from '../../utils/domUtils'
import storeUtils from '../redux/storeUtils.js'
import actions from './actions.js'
import * as d3 from 'd3'

export default (store) => {
  const data = [
    {
      status: 200,
      gender: "Male",
      credit: "Yes"
    },
    {
      status: 422,
      gender: "Female",
      credit: "Yes"
    },
    {
      status: 500,
      gender: "Female",
      credit: "Yes"
    },
    {
      status: 200,
      gender: "Female",
      credit: "Yes"
    },
    {
      status: 422,
      gender: "Female",
      credit: "Yes"
    },
    {
      status: 500,
      gender: "Male",
      credit: "Yes"
    },
    {
      status: 200,
      gender: "Male",
      credit: "Yes"
    },
    {
      status: 422,
      gender: "Male",
      credit: "Yes"
    }
  ]

  storeUtils.dispatch(actions.storeDataset(data))
}

let fileReader = undefined

export const loadCSV = (file) => {
  readFile(file, parseCSV)
}

export const loadJSON = (file) => {
  readFile(file, parseJSON)
}

const readFile = (file, callback) => {
  fileReader = new FileReader()
  fileReader.addEventListener("load", callback, false)
  fileReader.readAsText(file)
  renderFileName(file)
}

const renderFileName = (file) => {
  const fileNameSpan = d3.select(elementsProvider.FILE_NAME)
  const titulo1 = d3.select(elementsProvider.MODELS)
  const titulo2 = d3.select(elementsProvider.FEATURES)
  var file = file.name
  var name = file.split(".")
  var fileName = name[0]
  fileNameSpan.text(fileName)

  titulo1.text('Models')
 
  
  titulo2.text('Features')
}
const parseCSV = () => {
  const data = d3.csvParse(fileReader.result)
  storeUtils.dispatch(actions.storeDataset(data))
}

const parseJSON = () => {
  const data = JSON.parse(fileReader.result).items
  storeUtils.dispatch(actions.storeDataset(data))
}