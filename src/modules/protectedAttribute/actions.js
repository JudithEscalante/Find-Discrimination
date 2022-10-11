export const TOGGLE_SIDEBAR_PROTECTED = 'TOGGLE_SIDEBAR_PROTECTED'

export const toggleSidebarProtected = (featureName) => {
  return () => {
    return {
      type: TOGGLE_SIDEBAR_PROTECTED,
      payload: { featureName }
    }
  }
}


export default {toggleSidebarProtected}