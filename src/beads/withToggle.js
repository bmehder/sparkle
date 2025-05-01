export const withToggle = obj => {
  const isOn = obj.isOn ?? false
  return {
    isOn,
    toggle: () => ({ ...obj, isOn: !isOn }),
  }
}
