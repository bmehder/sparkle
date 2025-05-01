export const withCountToggles = obj => {
  const toggleCount = obj.toggleCount ?? 0
  return {
    toggleCount,
    countToggle: () => ({ ...obj, toggleCount: toggleCount + 1 })
  }
}
