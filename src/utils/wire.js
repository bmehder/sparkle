export const createWiring = (ref, update) =>
  (elKey, event, action) =>
    ref.value.el[elKey][`on${event}`] = () => update(action)
