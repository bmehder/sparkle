export const registerApp = ({ appRef, render, setup }) => {
  render(appRef.value)
  if (typeof setup === 'function') setup()
}
