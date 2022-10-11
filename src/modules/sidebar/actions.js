export const TOGGLE_SIDEBAR_FILTER = 'TOGGLE_SIDEBAR_FILTER'
export const TOGGLE_SIDEBAR_MODEL = 'TOGGLE_SIDEBAR_MODEL'

export const toggleSidebarFilter = (featureName) => {
  return () => {
    return {
      type: TOGGLE_SIDEBAR_FILTER,
      payload: { featureName }
    }
  }
}

export const toggleSidebarModel = (modelName) => {
  return () => {
    return {
      type: TOGGLE_SIDEBAR_FILTER,
      payload: { modelName }
    }
  }
}
export default { toggleSidebarModel, toggleSidebarFilter}
