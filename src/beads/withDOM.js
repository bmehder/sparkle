export const withDOM = obj => ({
  el: {
    label: document.getElementById('label'),
    toggle: document.getElementById('toggle')
  }
})
