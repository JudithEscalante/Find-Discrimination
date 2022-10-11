export const TOGGLE_PATH = 'TOGGLE_PATH'
export const TOGGLE_PATH_REMOVE = 'TOGGLE_PATH_REMOVE'

export const togglePath = (path) => {
    return () => {
      return {
        type: TOGGLE_PATH,
        payload: { path }
      }
    }
  }

  export const togglePathDelete = () => {
    return () => {
      return {
        type: TOGGLE_PATH_REMOVE,
        payload: {}
      }
    }

  }

  export default {togglePath, togglePathDelete}