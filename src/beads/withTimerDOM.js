export const withTimerDOM = obj => ({
  el: {
    ...obj.el,
    timeDisplay: document.getElementById('time-display'),
    start: document.getElementById('start'),
    stop: document.getElementById('stop'),
  }
})
