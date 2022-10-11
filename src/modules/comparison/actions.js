export const TOGGLE_SIDEBAR_COMPARISON = 'TOGGLE_SIDEBAR_COMPARISON'


export const toggleSidebarComparison = (option) => {
  
  return () => {
    return {
      type: TOGGLE_SIDEBAR_COMPARISON,
      payload: { option }
    }
    
  }
  
}
export default {toggleSidebarComparison}
