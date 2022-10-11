export const TOGGLE_SIDEBAR_MODEL = 'TOGGLE_SIDEBAR_MODEL'


export const toggleSidebarModel = (modelName) => {
  return () => {
    return {
      type: TOGGLE_SIDEBAR_MODEL,
      payload: { modelName }
    }
  }
}


export default {toggleSidebarModel}




